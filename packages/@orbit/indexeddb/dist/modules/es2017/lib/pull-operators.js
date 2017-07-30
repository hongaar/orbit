"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("@orbit/data");
exports.PullOperators = {
    findRecords: function (source, expression) {
        var operations = [];
        var types = expression.type ? [expression.type] : source.availableTypes;
        return types.reduce(function (chain, type) {
            return chain.then(function () {
                return source.getRecords(type)
                    .then(function (records) {
                    records.forEach(function (record) {
                        operations.push({
                            op: 'addRecord',
                            record: record
                        });
                    });
                });
            });
        }, data_1.default.Promise.resolve())
            .then(function () { return [data_1.buildTransform(operations)]; });
    },
    findRecord: function (source, expression) {
        return source.getRecord(expression.record)
            .then(function (record) {
            var operations = [{
                    op: 'addRecord',
                    record: record
                }];
            return [data_1.buildTransform(operations)];
        });
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVsbC1vcGVyYXRvcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvbGliL3B1bGwtb3BlcmF0b3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esb0NBTXFCO0FBT1IsUUFBQSxhQUFhLEdBQXVCO0lBQy9DLFdBQVcsRUFBWCxVQUFZLE1BQXVCLEVBQUUsVUFBdUI7UUFDMUQsSUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDO1FBRXRCLElBQUksS0FBSyxHQUFHLFVBQVUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQztRQUV4RSxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFDLEtBQUssRUFBRSxJQUFJO1lBQzlCLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO2dCQUNoQixNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7cUJBQzNCLElBQUksQ0FBQyxVQUFBLE9BQU87b0JBQ1gsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFBLE1BQU07d0JBQ3BCLFVBQVUsQ0FBQyxJQUFJLENBQUM7NEJBQ2QsRUFBRSxFQUFFLFdBQVc7NEJBQ2YsTUFBTSxRQUFBO3lCQUNQLENBQUMsQ0FBQztvQkFDTCxDQUFDLENBQUMsQ0FBQztnQkFDTCxDQUFDLENBQUMsQ0FBQztZQUNQLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxFQUFFLGNBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7YUFDeEIsSUFBSSxDQUFDLGNBQU0sT0FBQSxDQUFDLHFCQUFjLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBNUIsQ0FBNEIsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFRCxVQUFVLEVBQVYsVUFBVyxNQUF1QixFQUFFLFVBQXNCO1FBQ3hELE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7YUFDdkMsSUFBSSxDQUFDLFVBQUEsTUFBTTtZQUNWLElBQU0sVUFBVSxHQUFHLENBQUM7b0JBQ2xCLEVBQUUsRUFBRSxXQUFXO29CQUNmLE1BQU0sUUFBQTtpQkFDUCxDQUFDLENBQUM7WUFDSCxNQUFNLENBQUMsQ0FBQyxxQkFBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDdEMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0NBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpY3QsIGlzTm9uZSB9IGZyb20gJ0BvcmJpdC91dGlscyc7XHJcbmltcG9ydCBPcmJpdCwge1xyXG4gIFF1ZXJ5RXhwcmVzc2lvbixcclxuICBUcmFuc2Zvcm0sXHJcbiAgRmluZFJlY29yZCxcclxuICBGaW5kUmVjb3JkcyxcclxuICBidWlsZFRyYW5zZm9ybVxyXG59IGZyb20gJ0BvcmJpdC9kYXRhJztcclxuaW1wb3J0IEluZGV4ZWREQlNvdXJjZSBmcm9tICcuLi9zb3VyY2UnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBQdWxsT3BlcmF0b3Ige1xyXG4gIChzb3VyY2U6IEluZGV4ZWREQlNvdXJjZSwgZXhwcmVzc2lvbjogUXVlcnlFeHByZXNzaW9uKTogUHJvbWlzZTxUcmFuc2Zvcm1bXT47XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBQdWxsT3BlcmF0b3JzOiBEaWN0PFB1bGxPcGVyYXRvcj4gPSB7XHJcbiAgZmluZFJlY29yZHMoc291cmNlOiBJbmRleGVkREJTb3VyY2UsIGV4cHJlc3Npb246IEZpbmRSZWNvcmRzKTogUHJvbWlzZTxUcmFuc2Zvcm1bXT4ge1xyXG4gICAgY29uc3Qgb3BlcmF0aW9ucyA9IFtdO1xyXG5cclxuICAgIGxldCB0eXBlcyA9IGV4cHJlc3Npb24udHlwZSA/IFtleHByZXNzaW9uLnR5cGVdIDogc291cmNlLmF2YWlsYWJsZVR5cGVzO1xyXG5cclxuICAgIHJldHVybiB0eXBlcy5yZWR1Y2UoKGNoYWluLCB0eXBlKSA9PiB7XHJcbiAgICAgIHJldHVybiBjaGFpbi50aGVuKCgpID0+IHtcclxuICAgICAgICByZXR1cm4gc291cmNlLmdldFJlY29yZHModHlwZSlcclxuICAgICAgICAgIC50aGVuKHJlY29yZHMgPT4ge1xyXG4gICAgICAgICAgICByZWNvcmRzLmZvckVhY2gocmVjb3JkID0+IHtcclxuICAgICAgICAgICAgICBvcGVyYXRpb25zLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgb3A6ICdhZGRSZWNvcmQnLFxyXG4gICAgICAgICAgICAgICAgcmVjb3JkXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSwgT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCkpXHJcbiAgICAgIC50aGVuKCgpID0+IFtidWlsZFRyYW5zZm9ybShvcGVyYXRpb25zKV0pO1xyXG4gIH0sXHJcblxyXG4gIGZpbmRSZWNvcmQoc291cmNlOiBJbmRleGVkREJTb3VyY2UsIGV4cHJlc3Npb246IEZpbmRSZWNvcmQpOiBQcm9taXNlPFRyYW5zZm9ybVtdPiB7XHJcbiAgICByZXR1cm4gc291cmNlLmdldFJlY29yZChleHByZXNzaW9uLnJlY29yZClcclxuICAgICAgLnRoZW4ocmVjb3JkID0+IHtcclxuICAgICAgICBjb25zdCBvcGVyYXRpb25zID0gW3tcclxuICAgICAgICAgIG9wOiAnYWRkUmVjb3JkJyxcclxuICAgICAgICAgIHJlY29yZFxyXG4gICAgICAgIH1dO1xyXG4gICAgICAgIHJldHVybiBbYnVpbGRUcmFuc2Zvcm0ob3BlcmF0aW9ucyldO1xyXG4gICAgICB9KTtcclxuICB9XHJcbn07XHJcbiJdfQ==