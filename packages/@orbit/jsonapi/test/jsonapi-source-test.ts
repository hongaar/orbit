import Orbit, {
  buildTransform,
  ClientError,
  KeyMap,
  NetworkError,
  Record,
  RecordIdentity,
  RecordOperation,
  AddRecordOperation,
  ReplaceRecordOperation,
  Transform,
  TransformNotAllowed,
  Schema,
  Source
} from '@orbit/data';
import { clone } from '@orbit/utils';
import JSONAPISource from '../src/jsonapi-source';
import { getTransformRequests, TransformRequestProcessors } from '../src/lib/transform-requests';
import { buildFetchSettings } from '../src/lib/request-settings';
import { JSONAPIDocument } from '../src/jsonapi-document';
import { DeserializedDocument } from '../src/jsonapi-serializer';
import { jsonapiResponse } from './support/jsonapi';
import './test-helper';

declare const sinon: any;

const { module, test } = QUnit;

module('JSONAPISource', function(hooks) {
  let fetchStub;
  let keyMap: KeyMap;
  let schema: Schema;
  let source: JSONAPISource;

  module('with a secondary key', function(hooks) {
    hooks.beforeEach(() => {
      fetchStub = sinon.stub(Orbit, 'fetch');

      let schema = new Schema({
        models: {
          planet: {
            keys: {
              remoteId: {}
            },
            attributes: {
              name: { type: 'string' },
              classification: { type: 'string' },
              lengthOfDay: { type: 'number' }
            },
            relationships: {
              moons: { type: 'hasMany', model: 'moon', inverse: 'planet' },
              solarSystem: { type: 'hasOne', model: 'solarSystem', inverse: 'planets' }
            }
          },
          moon: {
            keys: {
              remoteId: {}
            },
            attributes: {
              name: { type: 'string' }
            },
            relationships: {
              planet: { type: 'hasOne', model: 'planet', inverse: 'moons' }
            }
          },
          solarSystem: {
            keys: {
              remoteId: {}
            },
            attributes: {
              name: { type: 'string' }
            },
            relationships: {
              planets: { type: 'hasMany', model: 'planet', inverse: 'solarSystem' }
            }
          }
        }
      });

      keyMap = new KeyMap();
      source = new JSONAPISource({ schema, keyMap });

      source.serializer.resourceKey = function() { return 'remoteId'; };
    });

    hooks.afterEach(() => {
      keyMap = schema = source = null;

      fetchStub.restore();
    });

    test('it exists', function(assert) {
      assert.ok(source);
    });

    test('its prototype chain is correct', function(assert) {
      assert.ok(source instanceof Source, 'instanceof Source');
    });

    test('source saves options', function(assert) {
      assert.expect(5);
      let schema = new Schema({});
      source = new JSONAPISource({ schema, keyMap, host: '127.0.0.1:8888', namespace: 'api', defaultFetchHeaders: { 'User-Agent': 'CERN-LineMode/2.15 libwww/2.17b3' } });
      assert.equal(source.namespace, 'api', 'Namespace should be defined');
      assert.equal(source.host, '127.0.0.1:8888', 'Host should be defined');
      assert.equal(source.defaultFetchHeaders['User-Agent'], 'CERN-LineMode/2.15 libwww/2.17b3', 'Headers should be defined');
      assert.equal(source.resourceNamespace(), source.namespace, 'Default namespace should be used by default');
      assert.equal(source.resourceHost(), source.host, 'Default host should be used by default');
    });

    test('#resourcePath - returns resource\'s path without its host and namespace', function(assert) {
      assert.expect(1);
      source.host = 'http://127.0.0.1:8888';
      source.namespace = 'api';
      keyMap.pushRecord({ type: 'planet', id: '1', keys: { remoteId: 'a' }, attributes: { name: 'Jupiter' } });

      assert.equal(source.resourcePath('planet', '1'), 'planets/a', 'resourcePath returns the path to the resource relative to the host and namespace');
    });

    test('#resourceURL - respects options to construct URLs', function(assert) {
      assert.expect(1);
      source.host = 'http://127.0.0.1:8888';
      source.namespace = 'api';
      keyMap.pushRecord({ type: 'planet', id: '1', keys: { remoteId: 'a' }, attributes: { name: 'Jupiter' } });

      assert.equal(source.resourceURL('planet', '1'), 'http://127.0.0.1:8888/api/planets/a', 'resourceURL method should use the options to construct URLs');
    });

    test('#resourceRelationshipURL - constructs relationship URLs based upon base resourceURL', function(assert) {
      assert.expect(1);
      keyMap.pushRecord({ type: 'planet', id: '1', keys: { remoteId: 'a' }, attributes: { name: 'Jupiter' } });

      assert.equal(source.resourceRelationshipURL('planet', '1', 'moons'), '/planets/a/relationships/moons', 'resourceRelationshipURL appends /relationships/[relationship] to resourceURL');
    });

    test('#defaultFetchHeaders - include JSONAPI Accept header by default', function(assert) {
      assert.deepEqual(source.defaultFetchHeaders, { Accept: 'application/vnd.api+json' }, 'Default headers should include JSONAPI Accept header');
    });

    test('#defaultFetchTimeout - is 5000ms by default', function(assert) {
      assert.equal(source.defaultFetchTimeout, 5000, 'By default fetches will timeout after 5s');
    });

    test('#responseHasContent - returns true if JSONAPI media type appears anywhere in Content-Type header', function(assert) {
      let response = new Orbit.globals.Response('{ data: null }', { headers: { 'Content-Type': 'application/vnd.api+json' } });
      assert.equal(source.responseHasContent(response), true, 'Accepts content that is _only_ the JSONAPI media type.');

      response = new Orbit.globals.Response('{ data: null }', { headers: { 'Content-Type': 'application/json,application/vnd.api+json; charset=utf-8' } });
      assert.equal(source.responseHasContent(response), true, 'Position of JSONAPI media type is not important.');

      response = new Orbit.globals.Response('{ data: null }', { headers: { 'Content-Type': 'application/json' } });
      assert.equal(source.responseHasContent(response), false, 'Plain json can not be parsed by default.');
    });

    test('#push - can add records', function(assert) {
      assert.expect(6);

      let transformCount = 0;

      let planet: Record = source.serializer.deserializeResource({ type: 'planet', attributes: { name: 'Jupiter', classification: 'gas giant' } });

      let addPlanetOp = {
        op: 'addRecord',
        record: {
          type: 'planet',
          id: planet.id,
          attributes: {
            name: 'Jupiter',
            classification: 'gas giant'
          }
        }
      };

      let addPlanetRemoteIdOp = {
        op: 'replaceKey',
        record: { type: 'planet', id: planet.id },
        key: 'remoteId',
        value: '12345'
      };

      source.on('transform', <() => void>function(transform) {
        transformCount++;

        if (transformCount === 1) {
          assert.deepEqual(
            transform.operations,
            [addPlanetOp],
            'transform event initially returns add-record op'
          );
        } else if (transformCount === 2) {
          // Remote ID is added as a separate operation
          assert.deepEqual(
            transform.operations,
            [addPlanetRemoteIdOp],
            'transform event then returns add-remote-id op'
          );
        }
      });

      fetchStub
        .withArgs('/planets')
        .returns(jsonapiResponse(201, {
          data: { id: '12345', type: 'planets', attributes: { name: 'Jupiter', classification: 'gas giant' } }
        }));

      return source.push(t => t.addRecord(planet))
        .then(function() {
          assert.ok(true, 'transform resolves successfully');

          assert.equal(fetchStub.callCount, 1, 'fetch called once');
          assert.equal(fetchStub.getCall(0).args[1].method, 'POST', 'fetch called with expected method');
          assert.deepEqual(
            JSON.parse(fetchStub.getCall(0).args[1].body),
            {
              data: {
                type: 'planets',
                attributes: {
                  name: 'Jupiter',
                  classification: 'gas giant'
                }
              }
            },
            'fetch called with expected data'
          );
        });
    });

    test('#push - can transform records', function(assert) {
      assert.expect(5);

      let transformCount = 0;

      let planet = source.serializer.deserializeResource({
        type: 'planet',
        id: '12345',
        attributes: {
          name: 'Jupiter',
          classification: 'gas giant'
        }
      });

      let replacePlanetOp = {
        op: 'replaceRecord',
        record: {
          type: 'planet',
          id: planet.id,
          attributes: {
            name: 'Jupiter',
            classification: 'gas giant'
          },
          keys: {
            remoteId: '12345'
          }
        }
      };

      source.on('transform', <() => void>function(transform) {
        transformCount++;

        if (transformCount === 1) {
          assert.deepEqual(
            transform.operations,
            [replacePlanetOp],
            'transform event initially returns replace-record op'
          );
        }
      });

      fetchStub
        .withArgs('/planets/12345')
        .returns(
          jsonapiResponse(
            200,
            { data: { id: '12345', type: 'planets', attributes: { name: 'Jupiter', classification: 'gas giant' } } }
          )
        );

      return source.push(t => t.replaceRecord(planet))
        .then(() => {
          assert.ok(true, 'transform resolves successfully');

          assert.equal(fetchStub.callCount, 1, 'fetch called once');
          assert.equal(fetchStub.getCall(0).args[1].method, 'PATCH', 'fetch called with expected method');
          assert.deepEqual(
            JSON.parse(fetchStub.getCall(0).args[1].body),
            {
              data: {
                type: 'planets',
                id: '12345',
                attributes: {
                  name: 'Jupiter',
                  classification: 'gas giant'
                }
              }
            },
            'fetch called with expected data'
          );
        });
    });

    test('#push - can replace a single attribute', function(assert) {
      assert.expect(4);

      let planet = source.serializer.deserializeResource({
        type: 'planet',
        id: '12345',
        attributes: {
          name: 'Jupiter',
          classification: 'gas giant'
        }
      });

      fetchStub
        .withArgs('/planets/12345')
        .returns(jsonapiResponse(200));

      return source.push(t => t.replaceAttribute(planet, 'classification', 'terrestrial'))
        .then(() => {
          assert.ok(true, 'record patched');

          assert.equal(fetchStub.callCount, 1, 'fetch called once');
          assert.equal(fetchStub.getCall(0).args[1].method, 'PATCH', 'fetch called with expected method');
          assert.deepEqual(
            JSON.parse(fetchStub.getCall(0).args[1].body),
            {
              data: {
                type: 'planets',
                id: '12345',
                attributes: {
                  classification: 'terrestrial'
                }
              }
            },
            'fetch called with expected data'
          );
        });
    });

    test('#push - can delete records', function(assert) {
      assert.expect(4);

      let planet = source.serializer.deserializeResource({
        type: 'planet',
        id: '12345'
      });

      fetchStub
        .withArgs('/planets/12345')
        .returns(jsonapiResponse(200));

      return source.push(t => t.removeRecord(planet))
        .then(() => {
          assert.ok(true, 'record deleted');

          assert.equal(fetchStub.callCount, 1, 'fetch called once');
          assert.equal(fetchStub.getCall(0).args[1].method, 'DELETE', 'fetch called with expected method');
          assert.equal(fetchStub.getCall(0).args[1].body, null, 'fetch called with no data');
        });
    });

    test('#push - can add a hasMany relationship with POST', function(assert) {
      assert.expect(4);

      let planet = source.serializer.deserializeResource({
        type: 'planet',
        id: '12345'
      });

      let moon = source.serializer.deserializeResource({
        type: 'moon',
        id: '987'
      });

      fetchStub
        .withArgs('/planets/12345/relationships/moons')
        .returns(jsonapiResponse(204));

      return source.push(t => t.addToRelatedRecords(planet, 'moons', moon))
        .then(() => {
          assert.ok(true, 'records linked');

          assert.equal(fetchStub.callCount, 1, 'fetch called once');
          assert.equal(fetchStub.getCall(0).args[1].method, 'POST', 'fetch called with expected method');
          assert.deepEqual(
            JSON.parse(fetchStub.getCall(0).args[1].body),
            { data: [{ type: 'moons', id: '987' }] },
            'fetch called with expected data'
          );
        });
    });

    test('#push - can remove a relationship with DELETE', function(assert) {
      assert.expect(4);

      let planet = source.serializer.deserializeResource({
        type: 'planet',
        id: '12345'
      });

      let moon = source.serializer.deserializeResource({
        type: 'moon',
        id: '987'
      });

      fetchStub
        .withArgs('/planets/12345/relationships/moons')
        .returns(jsonapiResponse(200));

      return source.push(t => t.removeFromRelatedRecords(planet, 'moons', moon))
        .then(function() {
          assert.ok(true, 'records unlinked');

          assert.equal(fetchStub.callCount, 1, 'fetch called once');
          assert.equal(fetchStub.getCall(0).args[1].method, 'DELETE', 'fetch called with expected method');
          assert.deepEqual(
            JSON.parse(fetchStub.getCall(0).args[1].body),
            { data: [{ type: 'moons', id: '987' }] },
            'fetch called with expected data'
          );
        });
    });

    test('#push - can update a hasOne relationship with PATCH', function(assert) {
      assert.expect(4);

      let planet = source.serializer.deserializeResource({
        type: 'planet',
        id: '12345'
      });

      let moon = source.serializer.deserializeResource({
        type: 'moon',
        id: '987'
      });

      fetchStub
        .withArgs('/moons/987')
        .returns(jsonapiResponse(200));

      return source.push(t => t.replaceRelatedRecord(moon, 'planet', planet))
        .then(function() {
          assert.ok(true, 'relationship replaced');

          assert.equal(fetchStub.callCount, 1, 'fetch called once');
          assert.equal(fetchStub.getCall(0).args[1].method, 'PATCH', 'fetch called with expected method');
          assert.deepEqual(
            JSON.parse(fetchStub.getCall(0).args[1].body),
            { data: { type: 'moons', id: '987', relationships: { planet: { data: { type: 'planets', id: '12345' } } } } },
            'fetch called with expected data'
          );
        });
    });

    test('#push - can clear a hasOne relationship with PATCH', function(assert) {
      assert.expect(4);

      let moon = source.serializer.deserializeResource({
        type: 'moon',
        id: '987'
      });

      fetchStub
        .withArgs('/moons/987')
        .returns(jsonapiResponse(200));

      return source.push(t => t.replaceRelatedRecord(moon, 'planet', null))
        .then(function() {
          assert.ok(true, 'relationship replaced');

          assert.equal(fetchStub.callCount, 1, 'fetch called once');
          assert.equal(fetchStub.getCall(0).args[1].method, 'PATCH', 'fetch called with expected method');
          assert.deepEqual(
            JSON.parse(fetchStub.getCall(0).args[1].body),
            { data: { type: 'moons', id: '987', relationships: { planet: { data: null } } } },
            'fetch called with expected data'
          );
        });
    });

    test('#push - can replace a hasMany relationship with PATCH', function(assert) {
      assert.expect(4);

      let planet = source.serializer.deserializeResource({
        type: 'planet',
        id: '12345'
      });

      let moon = source.serializer.deserializeResource({
        type: 'moon',
        id: '987'
      });

      fetchStub
        .withArgs('/planets/12345')
        .returns(jsonapiResponse(200));

      return source.push(t => t.replaceRelatedRecords(planet, 'moons', [moon]))
        .then(function() {
          assert.ok(true, 'relationship replaced');

          assert.equal(fetchStub.callCount, 1, 'fetch called once');
          assert.equal(fetchStub.getCall(0).args[1].method, 'PATCH', 'fetch called with expected method');
          assert.deepEqual(
            JSON.parse(fetchStub.getCall(0).args[1].body),
            { data: { type: 'planets', id: '12345', relationships: { moons: { data: [{ type: 'moons', id: '987' }] } } } },
            'fetch called with expected data'
          );
        });
    });

    test('#push - a single transform can result in multiple requests', function(assert) {
      assert.expect(6);

      let planet1 = source.serializer.deserializeResource({ type: 'planet', id: '1' });
      let planet2 = source.serializer.deserializeResource({ type: 'planet', id: '2' });

      fetchStub
        .withArgs('/planets/1')
        .returns(jsonapiResponse(200));

      fetchStub
        .withArgs('/planets/2')
        .returns(jsonapiResponse(200));

      return source.push(t => [
        t.removeRecord(planet1),
        t.removeRecord(planet2)
      ])
        .then(() => {
          assert.ok(true, 'records deleted');

          assert.equal(fetchStub.callCount, 2, 'fetch called twice');

          assert.equal(fetchStub.getCall(0).args[1].method, 'DELETE', 'fetch called with expected method');
          assert.equal(fetchStub.getCall(0).args[1].body, null, 'fetch called with no data');

          assert.equal(fetchStub.getCall(1).args[1].method, 'DELETE', 'fetch called with expected method');
          assert.equal(fetchStub.getCall(1).args[1].body, null, 'fetch called with no data');
        });
    });

    test('#push - source can limit the number of allowed requests per transform with `maxRequestsPerTransform`', function(assert) {
      assert.expect(1);

      let planet1 = source.serializer.deserializeResource({ type: 'planet', id: '1' });
      let planet2 = source.serializer.deserializeResource({ type: 'planet', id: '2' });

      source.maxRequestsPerTransform = 1;

      return source.push(t => [
        t.removeRecord(planet1),
        t.removeRecord(planet2)
      ])
        .catch(e => {
          assert.ok(e instanceof TransformNotAllowed, 'TransformNotAllowed thrown');
        });
    });

    test('#push - request can timeout', function(assert) {
      assert.expect(2);

      let planet = source.serializer.deserializeResource({
        type: 'planet',
        id: '12345',
        attributes: {
          name: 'Jupiter',
          classification: 'gas giant'
        }
      });

      // 10ms timeout
      source.defaultFetchTimeout = 10;

      fetchStub
        .withArgs('/planets/12345')
        .returns(jsonapiResponse(200, null, 20)); // 20ms delay

      return source.push(t => t.replaceAttribute(planet, 'classification', 'terrestrial'))
        .then(() => {
          assert.ok(false, 'should not be reached');
        })
        .catch(e => {
          assert.ok(e instanceof NetworkError, 'Network error raised');
          assert.equal(e.description, 'No fetch response within 10ms.')
        });
    });

    test('#push - allowed timeout can be specified per-request', function(assert) {
      assert.expect(2);

      let planet = source.serializer.deserializeResource({
        type: 'planet',
        id: '12345',
        attributes: {
          name: 'Jupiter',
          classification: 'gas giant'
        }
      });

      const options = {
        sources: {
          jsonapi: {
            timeout: 10 // 10ms timeout
          }
        }
      };

      fetchStub
        .withArgs('/planets/12345')
        .returns(jsonapiResponse(200, null, 20)); // 20ms delay

      return source.push(t => t.replaceAttribute(planet, 'classification', 'terrestrial'), options)
        .then(() => {
          assert.ok(false, 'should not be reached');
        })
        .catch(e => {
          assert.ok(e instanceof NetworkError, 'Network error raised');
          assert.equal(e.description, 'No fetch response within 10ms.')
        });
    });

    test('#push - fetch can reject with a NetworkError', function(assert) {
      assert.expect(2);

      let planet = source.serializer.deserializeResource({
        type: 'planet',
        id: '12345',
        attributes: {
          name: 'Jupiter',
          classification: 'gas giant'
        }
      });

      fetchStub
        .withArgs('/planets/12345')
        .returns(Orbit.Promise.reject(':('));

      return source.push(t => t.replaceAttribute(planet, 'classification', 'terrestrial'))
        .then(() => {
          assert.ok(false, 'should not be reached');
        })
        .catch(e => {
          assert.ok(e instanceof NetworkError, 'Network error raised');
          assert.equal(e.description, ':(')
        });
    });

    test('#push - response can trigger a ClientError', function(assert) {
      assert.expect(3);

      let planet = source.serializer.deserializeResource({
        type: 'planet',
        id: '12345',
        attributes: {
          name: 'Jupiter',
          classification: 'gas giant'
        }
      });

      let errors = [{
        status: "422",
        title: "Invalid classification specified"
      }];

      fetchStub
        .withArgs('/planets/12345')
        .returns(jsonapiResponse(422, { errors }));

      return source.push(t => t.replaceAttribute(planet, 'classification', 'terrestrial'))
        .then(() => {
          assert.ok(false, 'should not be reached');
        })
        .catch(e => {
          assert.ok(e instanceof ClientError, 'Client error raised');
          assert.equal(e.description, 'Unprocessable Entity');
          assert.deepEqual(e.data, { errors }, 'Error data included');
        });
    });

    test('#pull - record', function(assert) {
      assert.expect(5);

      const data = { type: 'planets', id: '12345', attributes: { name: 'Jupiter', classification: 'gas giant' } };

      const planet = source.serializer.deserializeResource({
        type: 'planet',
        id: '12345'
      });

      fetchStub
        .withArgs('/planets/12345')
        .returns(jsonapiResponse(200, { data }));

      return source.pull(q => q.findRecord({ type: 'planet', id: planet.id }))
        .then(transforms => {
          assert.equal(transforms.length, 1, 'one transform returned');
          assert.deepEqual(transforms[0].operations.map(o => o.op), ['replaceRecord']);
          assert.deepEqual(transforms[0].operations.map((o: ReplaceRecordOperation) => o.record.attributes.name), ['Jupiter']);

          assert.equal(fetchStub.callCount, 1, 'fetch called once');
          assert.equal(fetchStub.getCall(0).args[1].method, undefined, 'fetch called with no method (equivalent to GET)');
        });
    });

    test('#pull - request can timeout', function(assert) {
      assert.expect(2);

      const data = {
        type: 'planets',
        id: '12345',
        attributes: { name: 'Jupiter', classification: 'gas giant' } ,
        relationships: { moons: { data: [] } }
      };

      const planet = source.serializer.deserializeResource({
        type: 'planet',
        id: '12345'
      });

      // 10ms timeout
      source.defaultFetchTimeout = 10;

      fetchStub
        .withArgs('/planets/12345')
        .returns(jsonapiResponse(200, { data }, 20)); // 20ms delay

      return source.pull(q => q.findRecord({ type: 'planet', id: planet.id }))
        .then(() => {
          assert.ok(false, 'should not be reached');
        })
        .catch(e => {
          assert.ok(e instanceof NetworkError, 'Network error raised');
          assert.equal(e.description, 'No fetch response within 10ms.')
        });
    });

    test('#pull - allowed timeout can be specified per-request', function(assert) {
      assert.expect(2);

      const data = {
        type: 'planets',
        id: '12345',
        attributes: { name: 'Jupiter', classification: 'gas giant' } ,
        relationships: { moons: { data: [] } }
      };

      const planet = source.serializer.deserializeResource({
        type: 'planet',
        id: '12345'
      });

      const options = {
        sources: {
          jsonapi: {
            timeout: 10 // 10ms timeout
          }
        }
      };

      fetchStub
        .withArgs('/planets/12345')
        .returns(jsonapiResponse(200, { data }, 20)); // 20ms delay

      return source.pull(q => q.findRecord({ type: 'planet', id: planet.id }), options)
        .then(() => {
          assert.ok(false, 'should not be reached');
        })
        .catch(e => {
          assert.ok(e instanceof NetworkError, 'Network error raised');
          assert.equal(e.description, 'No fetch response within 10ms.')
        });
    });

    test('#pull - fetch can reject with a NetworkError', function(assert) {
      assert.expect(2);

      const data = {
        type: 'planets',
        id: '12345',
        attributes: { name: 'Jupiter', classification: 'gas giant' } ,
        relationships: { moons: { data: [] } }
      };

      const planet = source.serializer.deserializeResource({
        type: 'planet',
        id: '12345'
      });

      fetchStub
        .withArgs('/planets/12345')
        .returns(Orbit.Promise.reject(':('));

      return source.pull(q => q.findRecord({ type: 'planet', id: planet.id }))
        .then(() => {
          assert.ok(false, 'should not be reached');
        })
        .catch(e => {
          assert.ok(e instanceof NetworkError, 'Network error raised');
          assert.equal(e.description, ':(')
        });
    });

    test('#pull - record with include', function(assert) {
      assert.expect(2);

      const data = {
        type: 'planets',
        id: '12345',
        attributes: { name: 'Jupiter', classification: 'gas giant' } ,
        relationships: { moons: { data: [] } }
      };

      const planet = source.serializer.deserializeResource({
        type: 'planet',
        id: '12345'
      });

      const options = {
        sources: {
          jsonapi: {
            include: ['moons']
          }
        }
      };

      fetchStub
        .withArgs('/planets/12345?include=moons')
        .returns(jsonapiResponse(200, { data }));

      return source.pull(q => q.findRecord({ type: 'planet', id: planet.id }), options)
        .then(() => {
          assert.equal(fetchStub.callCount, 1, 'fetch called once');
          assert.equal(fetchStub.getCall(0).args[1].method, undefined, 'fetch called with no method (equivalent to GET)');
        });
    });

    test('#pull - records', function(assert) {
      assert.expect(5);

      const data = [
        { type: 'planets', attributes: { name: 'Jupiter', classification: 'gas giant' } },
        { type: 'planets', attributes: { name: 'Earth', classification: 'terrestrial' } },
        { type: 'planets', attributes: { name: 'Saturn', classification: 'gas giant' } }
      ];

      fetchStub
        .withArgs('/planets')
        .returns(jsonapiResponse(200, { data }));

      return source.pull(q => q.findRecords('planet'))
        .then(transforms => {
          assert.equal(transforms.length, 1, 'one transform returned');
          assert.deepEqual(transforms[0].operations.map(o => o.op), ['replaceRecord', 'replaceRecord', 'replaceRecord']);
          assert.deepEqual(transforms[0].operations.map((o: ReplaceRecordOperation) => o.record.attributes.name), ['Jupiter', 'Earth', 'Saturn']);

          assert.equal(fetchStub.callCount, 1, 'fetch called once');
          assert.equal(fetchStub.getCall(0).args[1].method, undefined, 'fetch called with no method (equivalent to GET)');
        });
    });

    test('#pull - records with filter', function(assert) {
      assert.expect(5);

      const data = [
        { type: 'planets', attributes: { name: 'Earth', classification: 'terrestrial', lengthOfDay: 24 } }
      ];

      fetchStub
        .withArgs(`/planets?${encodeURIComponent('filter[length-of-day]')}=24`)
        .returns(jsonapiResponse(200, { data }));

      return source.pull(q => q.findRecords('planet')
                               .filter({ attribute: 'lengthOfDay', value: 24 }))
        .then(transforms => {
          assert.equal(transforms.length, 1, 'one transform returned');
          assert.deepEqual(transforms[0].operations.map(o => o.op), ['replaceRecord']);
          assert.deepEqual(transforms[0].operations.map((o: ReplaceRecordOperation) => o.record.attributes.name), ['Earth']);

          assert.equal(fetchStub.callCount, 1, 'fetch called once');
          assert.equal(fetchStub.getCall(0).args[1].method, undefined, 'fetch called with no method (equivalent to GET)');
        });
    });

    test('#pull - records with sort by an attribute in ascending order', function(assert) {
      assert.expect(5);

      const data = [
        { type: 'planets', attributes: { name: 'Earth', classification: 'terrestrial' } },
        { type: 'planets', attributes: { name: 'Jupiter', classification: 'gas giant' } },
        { type: 'planets', attributes: { name: 'Saturn', classification: 'gas giant' } }
      ];

      fetchStub
        .withArgs('/planets?sort=name')
        .returns(jsonapiResponse(200, { data }));

      return source.pull(q => q.findRecords('planet').sort('name'))
        .then(transforms => {
          assert.equal(transforms.length, 1, 'one transform returned');
          assert.deepEqual(transforms[0].operations.map(o => o.op), ['replaceRecord', 'replaceRecord', 'replaceRecord']);
          assert.deepEqual(transforms[0].operations.map((o: ReplaceRecordOperation) => o.record.attributes.name), ['Earth', 'Jupiter', 'Saturn']);

          assert.equal(fetchStub.callCount, 1, 'fetch called once');
          assert.equal(fetchStub.getCall(0).args[1].method, undefined, 'fetch called with no method (equivalent to GET)');
        });
    });

    test('#pull - records with sort by an attribute in descending order', function(assert) {
      assert.expect(5);

      const data = [
        { type: 'planets', attributes: { name: 'Saturn', classification: 'gas giant' } },
        { type: 'planets', attributes: { name: 'Jupiter', classification: 'gas giant' } },
        { type: 'planets', attributes: { name: 'Earth', classification: 'terrestrial' } }
      ];

      fetchStub
        .withArgs('/planets?sort=-name')
        .returns(jsonapiResponse(200, { data }));

      return source.pull(q => q.findRecords('planet').sort('-name'))
        .then(transforms => {
          assert.equal(transforms.length, 1, 'one transform returned');
          assert.deepEqual(transforms[0].operations.map(o => o.op), ['replaceRecord', 'replaceRecord', 'replaceRecord']);
          assert.deepEqual(transforms[0].operations.map((o: ReplaceRecordOperation) => o.record.attributes.name), ['Saturn', 'Jupiter', 'Earth']);

          assert.equal(fetchStub.callCount, 1, 'fetch called once');
          assert.equal(fetchStub.getCall(0).args[1].method, undefined, 'fetch called with no method (equivalent to GET)');
        });
    });

    test('#pull - records with sort by multiple fields', function(assert) {
      assert.expect(5);

      const data = [
        { type: 'planets', attributes: { name: 'Jupiter', classification: 'gas giant', lengthOfDay: 9.9 } },
        { type: 'planets', attributes: { name: 'Saturn', classification: 'gas giant', lengthOfDay: 10.7 } },
        { type: 'planets', attributes: { name: 'Earth', classification: 'terrestrial', lengthOfDay: 24.0 } }
      ];

      fetchStub
        .withArgs(`/planets?sort=${encodeURIComponent('length-of-day,name')}`)
        .returns(jsonapiResponse(200, { data }));

      return source.pull(q => q.findRecords('planet').sort('lengthOfDay', 'name'))
        .then(transforms => {
          assert.equal(transforms.length, 1, 'one transform returned');
          assert.deepEqual(transforms[0].operations.map(o => o.op), ['replaceRecord', 'replaceRecord', 'replaceRecord']);
          assert.deepEqual(transforms[0].operations.map((o: ReplaceRecordOperation) => o.record.attributes.name), ['Jupiter', 'Saturn', 'Earth']);

          assert.equal(fetchStub.callCount, 1, 'fetch called once');
          assert.equal(fetchStub.getCall(0).args[1].method, undefined, 'fetch called with no method (equivalent to GET)');
        });
    });

    test('#pull - records with pagination', function(assert) {
      assert.expect(5);

      const data = [
        { type: 'planets', attributes: { name: 'Jupiter', classification: 'gas giant' } },
        { type: 'planets', attributes: { name: 'Earth', classification: 'terrestrial' } },
        { type: 'planets', attributes: { name: 'Saturn', classification: 'gas giant' } }
      ];

      fetchStub
        .withArgs(`/planets?${encodeURIComponent('page[offset]')}=1&${encodeURIComponent('page[limit]')}=10`)
        .returns(jsonapiResponse(200, { data }));

      return source.pull(q => q.findRecords('planet')
                               .page({ offset: 1, limit: 10 }))
        .then(transforms => {
          assert.equal(transforms.length, 1, 'one transform returned');
          assert.deepEqual(transforms[0].operations.map(o => o.op), ['replaceRecord', 'replaceRecord', 'replaceRecord']);
          assert.deepEqual(transforms[0].operations.map((o: ReplaceRecordOperation) => o.record.attributes.name), ['Jupiter', 'Earth', 'Saturn']);

          assert.equal(fetchStub.callCount, 1, 'fetch called once');
          assert.equal(fetchStub.getCall(0).args[1].method, undefined, 'fetch called with no method (equivalent to GET)');
        });
    });

    test('#pull - records with include', function(assert) {
      assert.expect(2);

      const options = {
        sources: {
          jsonapi: {
            include: ['moons']
          }
        }
      };

      fetchStub
        .withArgs('/planets?include=moons')
        .returns(jsonapiResponse(200, { data: [] }));

      return source.pull(q => q.findRecords('planet'), options)
        .then(() => {
          assert.equal(fetchStub.callCount, 1, 'fetch called once');
          assert.equal(fetchStub.getCall(0).args[1].method, undefined, 'fetch called with no method (equivalent to GET)');
        });
    });

    test('#pull - records with include many relationships', function(assert) {
      assert.expect(2);

      const options = {
        sources: {
          jsonapi: {
            include: ['moons', 'solar-systems']
          }
        }
      };

      fetchStub
        .withArgs(`/planets?include=${encodeURIComponent('moons,solar-systems')}`)
        .returns(jsonapiResponse(200, { data: [] }));

      return source.pull(q => q.findRecords('planet'), options)
        .then(() => {
          assert.equal(fetchStub.callCount, 1, 'fetch called once');
          assert.equal(fetchStub.getCall(0).args[1].method, undefined, 'fetch called with no method (equivalent to GET)');
        });
    });

    test('#pull - relatedRecords', function(assert) {
      assert.expect(5);

      let planetRecord: Record = <Record>source.serializer.deserializeDocument({
        data: {
          type: 'planets',
          id: 'jupiter'
        }
      }).data;

      let data = [{
        type: 'moons',
        id: 'io',
        attributes: {
          name: 'Io'
        }
      }];

      fetchStub
        .withArgs('/planets/jupiter/moons')
        .returns(jsonapiResponse(200, { data }));

      return source.pull(q => q.findRelatedRecords(planetRecord, 'moons')).then((transforms) => {
        assert.equal(transforms.length, 1, 'one transform returned');
        assert.deepEqual(transforms[0].operations.map(o => o.op), ['replaceRecord']);
        assert.deepEqual(transforms[0].operations.map((o: ReplaceRecordOperation) => o.record.attributes.name), ['Io']);

        assert.equal(fetchStub.callCount, 1, 'fetch called once');
        assert.equal(fetchStub.getCall(0).args[1].method, undefined, 'fetch called with no method (equivalent to GET)');
      });
    });

    test('#pull - relatedRecords with include', function(assert) {
      assert.expect(2);

      const planetRecord = source.serializer.deserializeDocument({
        data: {
          type: 'planets',
          id: 'jupiter'
        }
      }).data;

      const options = {
        sources: {
          jsonapi: {
            include: ['planet']
          }
        }
      };

      fetchStub
        .withArgs('/planets/jupiter/moons?include=planet')
        .returns(jsonapiResponse(200, { data: [] }));

      return source.pull(q => q.findRelatedRecords(<RecordIdentity>planetRecord, 'moons'), options)
        .then(() => {
          assert.equal(fetchStub.callCount, 1, 'fetch called once');
          assert.equal(fetchStub.getCall(0).args[1].method, undefined, 'fetch called with no method (equivalent to GET)');
        });
    });
  });

  module('with no secondary keys', function(hooks) {
    hooks.beforeEach(function() {
      fetchStub = sinon.stub(Orbit, 'fetch');

      let schema = new Schema({
        models: {
          planet: {
            attributes: {
              name: { type: 'string' },
              classification: { type: 'string' }
            },
            relationships: {
              moons: { type: 'hasMany', model: 'moon', inverse: 'planet' }
            }
          },
          moon: {
            attributes: {
              name: { type: 'string' }
            },
            relationships: {
              planet: { type: 'hasOne', model: 'planet', inverse: 'moons' }
            }
          }
        }
      });

      source = new JSONAPISource({ schema });
    });

    hooks.afterEach(function() {
      schema = source = null;
      fetchStub.restore();
    });

    test('#push - can add records', function(assert) {
      assert.expect(5);

      let transformCount = 0;

      let planet = {
        type: 'planet',
        id: 'jupiter',
        attributes: { name: 'Jupiter', classification: 'gas giant' }
      };

      let addPlanetOp = {
        op: 'addRecord',
        record: {
          type: 'planet',
          id: planet.id,
          attributes: {
            name: 'Jupiter',
            classification: 'gas giant'
          }
        }
      };

      source.on('transform', <() => void>function(transform) {
        transformCount++;

        if (transformCount === 1) {
          assert.deepEqual(
            transform.operations,
            [addPlanetOp],
            'transform event initially returns add-record op'
          );
        }
      });

      fetchStub
        .withArgs('/planets')
        .returns(jsonapiResponse(201, {
          data: { id: planet.id, type: 'planets', attributes: { name: 'Jupiter', classification: 'gas giant' } }
        }));

      return source.push(t => t.addRecord(planet))
        .then(function() {
          assert.ok(true, 'transform resolves successfully');

          assert.equal(fetchStub.callCount, 1, 'fetch called once');
          assert.equal(fetchStub.getCall(0).args[1].method, 'POST', 'fetch called with expected method');
          assert.deepEqual(
            JSON.parse(fetchStub.getCall(0).args[1].body),
            {
              data: {
                type: 'planets',
                id: planet.id,
                attributes: {
                  name: 'Jupiter',
                  classification: 'gas giant'
                }
              }
            },
            'fetch called with expected data'
          );
        });
    });
  });

  module('server generated ids', function(hooks) {
    hooks.beforeEach(function() {
      fetchStub = sinon.stub(Orbit, 'fetch');

      schema = new Schema({
        models: {
          planet: {
            attributes: {
              name: { type: 'string' },
              classification: { type: 'string' }
            },
            relationships: {
              moons: { type: 'hasMany', model: 'moon', inverse: 'planet' }
            }
          },
          moon: {
            attributes: {
              name: { type: 'string' }
            },
            relationships: {
              planet: { type: 'hasOne', model: 'planet', inverse: 'moons' }
            }
          }
        }
      });

      schema.initializeRecord = function(record: Record): void {
        // Don not generate ids
      }

      source = new JSONAPISource({ schema });

      source.addRecord = function(record: Record): Promise {
        const request = {
          op: 'addRecord',
          record: record
        };

        const { serializer } = this;
        const requestDoc: JSONAPIDocument = serializer.serializeDocument(record);
        const settings = buildFetchSettings(request, { method: 'POST', json: requestDoc });

        return this.fetch(this.resourceURL(record.type), settings)
          .then((raw: JSONAPIDocument) => {
            let responseDoc: DeserializedDocument = serializer.deserializeDocument(raw);
            let addedRecord: Record = <Record>responseDoc.data;
            let operations: RecordOperation[] = [this.transformBuilder.addRecord(addedRecord)];

            return [buildTransform(operations)];
          })
          .then(transforms => this._transformed(transforms));
      }
    });

    hooks.afterEach(function() {
      schema = source = null;
      fetchStub.restore();
    });

    test('#addRecord - do not generate local ids', function(assert) {
      let planet = {
        type: 'planet',
        attributes: { name: 'Jupiter', classification: 'gas giant' }
      }

      schema.initializeRecord(planet);
      assert.equal(planet.id, undefined, 'doesn\'t generate an ID if `id` is undefined');
    })

    test('#addRecord - can add records and receives server generated id', function(assert) {
      assert.expect(5);

      let transformCount = 0;

      let planet = {
        type: 'planet',
        attributes: { name: 'Jupiter', classification: 'gas giant' }
      };

      let addPlanetOp = {
        op: 'addRecord',
        record: {
          type: 'planet',
          id: 1,
          attributes: {
            name: 'Jupiter',
            classification: 'gas giant'
          }
        }
      };

      source.on('transform', <() => void>function(transform) {
        transformCount++;

        if (transformCount === 1) {
          assert.deepEqual(
            transform.operations,
            [addPlanetOp],
            'transform event receives server generated id'
          );
        }
      });

      fetchStub
        .withArgs('/planets')
        .returns(jsonapiResponse(201, {
          data: { id: 1, type: 'planets', attributes: { name: 'Jupiter', classification: 'gas giant' } }
        }));

      return source.addRecord(planet)
        .then(function() {
          assert.ok(true, 'transform resolves successfully');

          assert.equal(fetchStub.callCount, 1, 'fetch called once');
          assert.equal(fetchStub.getCall(0).args[1].method, 'POST', 'fetch called with expected method');
          assert.deepEqual(
            JSON.parse(fetchStub.getCall(0).args[1].body),
            {
              data: {
                type: 'planets',
                attributes: {
                  name: 'Jupiter',
                  classification: 'gas giant'
                }
              }
            },
            'fetch called with expected data'
          );
        });
    });
  });
});
