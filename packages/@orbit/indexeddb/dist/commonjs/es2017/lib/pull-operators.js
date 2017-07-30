"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("@orbit/data");
exports.PullOperators = {
    findRecords: function (source, expression) {
        var operations = [];
        var types = expression.type ? [expression.type] : source.availableTypes;
        return types.reduce(function (chain, type) {
            return chain.then(function () {
                return source.getRecords(type).then(function (records) {
                    records.forEach(function (record) {
                        operations.push({
                            op: 'addRecord',
                            record: record
                        });
                    });
                });
            });
        }, data_1.default.Promise.resolve()).then(function () {
            return [data_1.buildTransform(operations)];
        });
    },
    findRecord: function (source, expression) {
        return source.getRecord(expression.record).then(function (record) {
            var operations = [{
                op: 'addRecord',
                record: record
            }];
            return [data_1.buildTransform(operations)];
        });
    }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVsbC1vcGVyYXRvcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvbGliL3B1bGwtb3BlcmF0b3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHFCQU1xQjtBQU9SLFFBQUEsQUFBYTtBQUN4QixBQUFXLGlCQUFYLFVBQVksQUFBdUIsUUFBRSxBQUF1QjtBQUMxRCxZQUFNLEFBQVUsYUFBRyxBQUFFLEFBQUM7QUFFdEIsWUFBSSxBQUFLLFFBQUcsQUFBVSxXQUFDLEFBQUksT0FBRyxDQUFDLEFBQVUsV0FBQyxBQUFJLEFBQUMsUUFBRyxBQUFNLE9BQUMsQUFBYyxBQUFDO0FBRXhFLEFBQU0scUJBQU8sQUFBTSxPQUFDLFVBQUMsQUFBSyxPQUFFLEFBQUk7QUFDOUIsQUFBTSx5QkFBTyxBQUFJLEtBQUM7QUFDaEIsQUFBTSw4QkFBUSxBQUFVLFdBQUMsQUFBSSxBQUFDLE1BQzNCLEFBQUksS0FBQyxVQUFBLEFBQU87QUFDWCxBQUFPLDRCQUFDLEFBQU8sUUFBQyxVQUFBLEFBQU07QUFDcEIsQUFBVSxtQ0FBQyxBQUFJO0FBQ2IsQUFBRSxnQ0FBRSxBQUFXO0FBQ2YsQUFBTSxvQ0FBQSxBQUNQLEFBQUMsQUFBQyxBQUNMO0FBSmtCO0FBSWpCLEFBQUMsQUFBQyxBQUNMO0FBQUMsQUFBQyxBQUFDLEFBQ1AsaUJBVFMsQUFBTTtBQVNkLEFBQUMsQUFBQyxBQUNMLGFBWFMsQUFBSztBQVdiLFNBWk0sQUFBSyxFQVlULE9BQUssUUFBQyxBQUFPLFFBQUMsQUFBTyxBQUFFLEFBQUMsV0FDeEIsQUFBSSxLQUFDO0FBQU0sbUJBQUEsQ0FBQyxPQUFjLGVBQWYsQUFBZ0IsQUFBVSxBQUFDLEFBQUM7QUFBQSxBQUFDLEFBQUMsQUFDOUM7QUFBQztBQUVELEFBQVUsZ0JBQVYsVUFBVyxBQUF1QixRQUFFLEFBQXNCO0FBQ3hELEFBQU0sc0JBQVEsQUFBUyxVQUFDLEFBQVUsV0FBQyxBQUFNLEFBQUMsUUFDdkMsQUFBSSxLQUFDLFVBQUEsQUFBTTtBQUNWLGdCQUFNLEFBQVU7QUFDZCxBQUFFLG9CQUFFLEFBQVc7QUFDZixBQUFNLHdCQUFBLEFBQ1AsQUFBQyxBQUFDO0FBSGlCLGFBQUQ7QUFJbkIsQUFBTSxtQkFBQyxDQUFDLE9BQWMsZUFBQyxBQUFVLEFBQUMsQUFBQyxBQUFDLEFBQ3RDO0FBQUMsQUFBQyxBQUFDLEFBQ1AsU0FSUyxBQUFNO0FBUWQsQUFDRixBQUFDO0FBaEMrQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpY3QsIGlzTm9uZSB9IGZyb20gJ0BvcmJpdC91dGlscyc7XHJcbmltcG9ydCBPcmJpdCwge1xyXG4gIFF1ZXJ5RXhwcmVzc2lvbixcclxuICBUcmFuc2Zvcm0sXHJcbiAgRmluZFJlY29yZCxcclxuICBGaW5kUmVjb3JkcyxcclxuICBidWlsZFRyYW5zZm9ybVxyXG59IGZyb20gJ0BvcmJpdC9kYXRhJztcclxuaW1wb3J0IEluZGV4ZWREQlNvdXJjZSBmcm9tICcuLi9zb3VyY2UnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBQdWxsT3BlcmF0b3Ige1xyXG4gIChzb3VyY2U6IEluZGV4ZWREQlNvdXJjZSwgZXhwcmVzc2lvbjogUXVlcnlFeHByZXNzaW9uKTogUHJvbWlzZTxUcmFuc2Zvcm1bXT47XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBQdWxsT3BlcmF0b3JzOiBEaWN0PFB1bGxPcGVyYXRvcj4gPSB7XHJcbiAgZmluZFJlY29yZHMoc291cmNlOiBJbmRleGVkREJTb3VyY2UsIGV4cHJlc3Npb246IEZpbmRSZWNvcmRzKTogUHJvbWlzZTxUcmFuc2Zvcm1bXT4ge1xyXG4gICAgY29uc3Qgb3BlcmF0aW9ucyA9IFtdO1xyXG5cclxuICAgIGxldCB0eXBlcyA9IGV4cHJlc3Npb24udHlwZSA/IFtleHByZXNzaW9uLnR5cGVdIDogc291cmNlLmF2YWlsYWJsZVR5cGVzO1xyXG5cclxuICAgIHJldHVybiB0eXBlcy5yZWR1Y2UoKGNoYWluLCB0eXBlKSA9PiB7XHJcbiAgICAgIHJldHVybiBjaGFpbi50aGVuKCgpID0+IHtcclxuICAgICAgICByZXR1cm4gc291cmNlLmdldFJlY29yZHModHlwZSlcclxuICAgICAgICAgIC50aGVuKHJlY29yZHMgPT4ge1xyXG4gICAgICAgICAgICByZWNvcmRzLmZvckVhY2gocmVjb3JkID0+IHtcclxuICAgICAgICAgICAgICBvcGVyYXRpb25zLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgb3A6ICdhZGRSZWNvcmQnLFxyXG4gICAgICAgICAgICAgICAgcmVjb3JkXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSwgT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCkpXHJcbiAgICAgIC50aGVuKCgpID0+IFtidWlsZFRyYW5zZm9ybShvcGVyYXRpb25zKV0pO1xyXG4gIH0sXHJcblxyXG4gIGZpbmRSZWNvcmQoc291cmNlOiBJbmRleGVkREJTb3VyY2UsIGV4cHJlc3Npb246IEZpbmRSZWNvcmQpOiBQcm9taXNlPFRyYW5zZm9ybVtdPiB7XHJcbiAgICByZXR1cm4gc291cmNlLmdldFJlY29yZChleHByZXNzaW9uLnJlY29yZClcclxuICAgICAgLnRoZW4ocmVjb3JkID0+IHtcclxuICAgICAgICBjb25zdCBvcGVyYXRpb25zID0gW3tcclxuICAgICAgICAgIG9wOiAnYWRkUmVjb3JkJyxcclxuICAgICAgICAgIHJlY29yZFxyXG4gICAgICAgIH1dO1xyXG4gICAgICAgIHJldHVybiBbYnVpbGRUcmFuc2Zvcm0ob3BlcmF0aW9ucyldO1xyXG4gICAgICB9KTtcclxuICB9XHJcbn07XHJcbiJdfQ==