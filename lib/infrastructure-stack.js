"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdkInfrastructureStack = void 0;
const cdk = require("@aws-cdk/core");
const dynamodb = require("@aws-cdk/aws-dynamodb");
const aws_dynamodb_1 = require("@aws-cdk/aws-dynamodb");
const lambda = require("@aws-cdk/aws-lambda");
const apigateway = require("@aws-cdk/aws-apigateway");
const iam = require("@aws-cdk/aws-iam");
class CdkInfrastructureStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // DDB Table
        const table = new dynamodb.Table(this, 'DdbTable', {
            tableName: 'DdbTable',
            partitionKey: { name: 'name', type: aws_dynamodb_1.AttributeType.STRING },
            readCapacity: 1,
            writeCapacity: 5,
        });
        // Role 
        const create_role = new iam.Role(this, 'LambdaExecutionRole', {
            assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com')
        });
        // Lambda - CreateFunctionMonitorOperator
        const CreateFunctionMonitorOperator = new lambda.Function(this, 'CreateFunctionMonitorOperator', {
            runtime: lambda.Runtime.NODEJS_12_X,
            handler: 'index.handler',
            role: create_role,
            functionName: 'CreateFunctionMonitorOperator',
            code: lambda.Code.fromInline(`'use strict';
        const AWS = require('aws-sdk');
        const docClient = new AWS.DynamoDB.DocumentClient();
        const tableName = process.env.TABLE_NAME;
        exports.lambda_handler = (event, context, callback) => {
          console.log('Received event:', JSON.stringify(event, null, 2));
          const shop = create_shop_struct(event);
          var params = {
            TableName: tableName,
            Item: {
              name: shop.name,
              specialty: shop.specialty,
              address: shop.address,
              url: shop.url,
              description: shop.description
            }
          };
          docClient.put(params, function(err, data) {
            if (err) callback(err)
            callback(null, {
              statusCode: 200,
              body: JSON.stringify(shop)
            });
          });
        };
        
        var create_shop_struct = function(event) {
          const body = JSON.parse(event.body);
        
          return {
            name: body.name,
            specialty: body.specialty,
            address: body.address,
            url: body.url,
            description: body.description
          };
        };
        `)
        });
        // Role 
        const list_role = new iam.Role(this, 'ListLambdaRole', {
            assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com')
        });
        list_role.addManagedPolicy({
            managedPolicyArn: 'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole'
        });
        const list_policy = new iam.PolicyStatement({
            actions: ["dynamodb:BatchGetItem",
                "dynamodb:GetRecords",
                "dynamodb:GetShardIterator",
                "dynamodb:Query",
                "dynamodb:GetItem",
                "dynamodb:Scan",
                "dynamodb:BatchWriteItem",
                "dynamodb:PutItem",
                "dynamodb:UpdateItem",
                "dynamodb:DeleteItem"],
            resources: ['*'],
        });
        list_role.addToPolicy(list_policy);
        CreateFunctionMonitorOperator.addEnvironment("TABLE_NAME", table.tableName);
        // Role 
        const scan_role = new iam.Role(this, 'ScanLambdaRole', {
            assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com')
        });
        scan_role.addManagedPolicy({
            managedPolicyArn: 'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole'
        });
        const scan_policy = new iam.PolicyStatement({
            actions: ["dynamodb:BatchGetItem",
                "dynamodb:GetRecords",
                "dynamodb:GetShardIterator",
                "dynamodb:Query",
                "dynamodb:Scan",
                "dynamodb:GetItem"],
            resources: ['*'],
        });
        scan_role.addToPolicy(scan_policy);
        // Lambda - ScanFunctionMonitorOperator
        const ScanFunctionMonitorOperator = new lambda.Function(this, 'ScanFunctionMonitorOperator', {
            runtime: lambda.Runtime.NODEJS_12_X,
            handler: 'index.lambda_handler',
            role: scan_role,
            functionName: 'ScanFunctionMonitorOperator',
            code: lambda.Code.fromInline(`'use strict';
      const AWS = require('aws-sdk');
      const docClient = new AWS.DynamoDB.DocumentClient();
      const tableName = process.env.TABLE_NAME;
      exports.lambda_handler = (event, context, callback) => {
        console.log('Received event:', JSON.stringify(event, null, 2));
        var params = {
          TableName: tableName
        };
        docClient.scan(params, function(err, data) {
          if (err) callback(err)
          callback(null, {
            statusCode: 200,
            body: JSON.stringify(data.Items)
          });
        });
      };`)
        });
        ScanFunctionMonitorOperator.addEnvironment("TABLE_NAME", table.tableName);
        // API Gateway - CreateRestApiMonitorOperator
        const create_api = new apigateway.LambdaRestApi(this, 'CreateRestApiMonitorOperator', {
            description: 'Create Rest API',
            handler: CreateFunctionMonitorOperator,
            proxy: false,
            deployOptions: {
                loggingLevel: apigateway.MethodLoggingLevel.INFO,
                dataTraceEnabled: true
            },
            endpointConfiguration: {
                types: [apigateway.EndpointType.REGIONAL],
            }
        });
        create_api.root.addMethod('ANY');
        const create_items = create_api.root.addResource('{proxy+}').addMethod('ANY');
        // API Gateway - ListRestApiMonitorOperator
        const list_api = new apigateway.LambdaRestApi(this, 'ListRestApiMonitorOperator', {
            description: 'List Rest API',
            handler: ScanFunctionMonitorOperator,
            proxy: false,
            deployOptions: {
                loggingLevel: apigateway.MethodLoggingLevel.INFO,
                dataTraceEnabled: true
            },
            endpointConfiguration: {
                types: [apigateway.EndpointType.REGIONAL],
            }
        });
        list_api.root.addMethod('ANY');
        const list_items = list_api.root.addResource('{proxy+}').addMethod('ANY');
    }
}
exports.CdkInfrastructureStack = CdkInfrastructureStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5mcmFzdHJ1Y3R1cmUtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmZyYXN0cnVjdHVyZS1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxQ0FBcUM7QUFDckMsa0RBQW1EO0FBQ25ELHdEQUFzRDtBQUN0RCw4Q0FBK0M7QUFDL0Msc0RBQXVEO0FBQ3ZELHdDQUF5QztBQUV6QyxNQUFhLHNCQUF1QixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ2pELFlBQVksS0FBb0IsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDbEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFOUIsWUFBWTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQy9DLFNBQVMsRUFBRyxVQUFVO1lBQ3RCLFlBQVksRUFBRSxFQUFFLElBQUksRUFBRyxNQUFNLEVBQUUsSUFBSSxFQUFFLDRCQUFhLENBQUMsTUFBTSxFQUFDO1lBQzFELFlBQVksRUFBRyxDQUFDO1lBQ2hCLGFBQWEsRUFBRSxDQUFDO1NBQ25CLENBQUMsQ0FBQztRQUVQLFFBQVE7UUFDSixNQUFNLFdBQVcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLHFCQUFxQixFQUFFO1lBQzFELFNBQVMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxzQkFBc0IsQ0FBQztTQUM5RCxDQUFDLENBQUM7UUFFUCx5Q0FBeUM7UUFDckMsTUFBTSw2QkFBNkIsR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLCtCQUErQixFQUFFO1lBQzdGLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVc7WUFDbkMsT0FBTyxFQUFFLGVBQWU7WUFDeEIsSUFBSSxFQUFFLFdBQVc7WUFDakIsWUFBWSxFQUFHLCtCQUErQjtZQUM5QyxJ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QUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2pDLE1BQU0sWUFBWSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVsRiwyQ0FBMkM7UUFDdkMsTUFBTSxRQUFRLEdBQUcsSUFBSSxVQUFVLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSw0QkFBNEIsRUFBRTtZQUNoRixXQUFXLEVBQUUsZUFBZTtZQUM1QixPQUFPLEVBQUUsMkJBQTJCO1lBQ3BDLEtBQUssRUFBRSxLQUFLO1lBQ1osYUFBYSxFQUFFO2dCQUNiLFlBQVksRUFBRyxVQUFVLENBQUMsa0JBQWtCLENBQUMsSUFBSTtnQkFDakQsZ0JBQWdCLEVBQUUsSUFBSTthQUN2QjtZQUNELHFCQUFxQixFQUFFO2dCQUNyQixLQUFLLEVBQUUsQ0FBRSxVQUFVLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQzthQUMzQztTQUNGLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQy9CLE1BQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM1RSxDQUFDO0NBQ0Y7QUF2S0Qsd0RBdUtDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IGR5bmFtb2RiID0gcmVxdWlyZSgnQGF3cy1jZGsvYXdzLWR5bmFtb2RiJyk7XG5pbXBvcnQgeyBBdHRyaWJ1dGVUeXBlIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWR5bmFtb2RiJztcbmltcG9ydCBsYW1iZGEgPSByZXF1aXJlKCdAYXdzLWNkay9hd3MtbGFtYmRhJyk7XG5pbXBvcnQgYXBpZ2F0ZXdheSA9IHJlcXVpcmUoJ0Bhd3MtY2RrL2F3cy1hcGlnYXRld2F5Jyk7XG5pbXBvcnQgaWFtID0gcmVxdWlyZSgnQGF3cy1jZGsvYXdzLWlhbScpO1xuXG5leHBvcnQgY2xhc3MgQ2RrSW5mcmFzdHJ1Y3R1cmVTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcbiAgICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuICAgIFxuLy8gRERCIFRhYmxlXG4gICAgY29uc3QgdGFibGUgPSBuZXcgZHluYW1vZGIuVGFibGUodGhpcywgJ0RkYlRhYmxlJywge1xuICAgICAgICB0YWJsZU5hbWUgOiAnRGRiVGFibGUnLFxuICAgICAgICBwYXJ0aXRpb25LZXk6IHsgbmFtZSA6ICduYW1lJywgdHlwZTogQXR0cmlidXRlVHlwZS5TVFJJTkd9LFxuICAgICAgICByZWFkQ2FwYWNpdHkgOiAxLFxuICAgICAgICB3cml0ZUNhcGFjaXR5OiA1LFxuICAgIH0pO1xuXG4vLyBSb2xlIFxuICAgIGNvbnN0IGNyZWF0ZV9yb2xlID0gbmV3IGlhbS5Sb2xlKHRoaXMsICdMYW1iZGFFeGVjdXRpb25Sb2xlJywge1xuICAgICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnbGFtYmRhLmFtYXpvbmF3cy5jb20nKVxuICAgIH0pO1xuXG4vLyBMYW1iZGEgLSBDcmVhdGVGdW5jdGlvbk1vbml0b3JPcGVyYXRvclxuICAgIGNvbnN0IENyZWF0ZUZ1bmN0aW9uTW9uaXRvck9wZXJhdG9yID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnQ3JlYXRlRnVuY3Rpb25Nb25pdG9yT3BlcmF0b3InLCB7XG4gICAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xMl9YLFxuICAgICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICAgIHJvbGU6IGNyZWF0ZV9yb2xlLFxuICAgICAgICBmdW5jdGlvbk5hbWUgOiAnQ3JlYXRlRnVuY3Rpb25Nb25pdG9yT3BlcmF0b3InLCBcbiAgICAgICAgY29kZSA6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoYCd1c2Ugc3RyaWN0JztcbiAgICAgICAgY29uc3QgQVdTID0gcmVxdWlyZSgnYXdzLXNkaycpO1xuICAgICAgICBjb25zdCBkb2NDbGllbnQgPSBuZXcgQVdTLkR5bmFtb0RCLkRvY3VtZW50Q2xpZW50KCk7XG4gICAgICAgIGNvbnN0IHRhYmxlTmFtZSA9IHByb2Nlc3MuZW52LlRBQkxFX05BTUU7XG4gICAgICAgIGV4cG9ydHMubGFtYmRhX2hhbmRsZXIgPSAoZXZlbnQsIGNvbnRleHQsIGNhbGxiYWNrKSA9PiB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ1JlY2VpdmVkIGV2ZW50OicsIEpTT04uc3RyaW5naWZ5KGV2ZW50LCBudWxsLCAyKSk7XG4gICAgICAgICAgY29uc3Qgc2hvcCA9IGNyZWF0ZV9zaG9wX3N0cnVjdChldmVudCk7XG4gICAgICAgICAgdmFyIHBhcmFtcyA9IHtcbiAgICAgICAgICAgIFRhYmxlTmFtZTogdGFibGVOYW1lLFxuICAgICAgICAgICAgSXRlbToge1xuICAgICAgICAgICAgICBuYW1lOiBzaG9wLm5hbWUsXG4gICAgICAgICAgICAgIHNwZWNpYWx0eTogc2hvcC5zcGVjaWFsdHksXG4gICAgICAgICAgICAgIGFkZHJlc3M6IHNob3AuYWRkcmVzcyxcbiAgICAgICAgICAgICAgdXJsOiBzaG9wLnVybCxcbiAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHNob3AuZGVzY3JpcHRpb25cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICAgIGRvY0NsaWVudC5wdXQocGFyYW1zLCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICAgICAgICAgIGlmIChlcnIpIGNhbGxiYWNrKGVycilcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHtcbiAgICAgICAgICAgICAgc3RhdHVzQ29kZTogMjAwLFxuICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShzaG9wKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICB2YXIgY3JlYXRlX3Nob3Bfc3RydWN0ID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICBjb25zdCBib2R5ID0gSlNPTi5wYXJzZShldmVudC5ib2R5KTtcbiAgICAgICAgXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG5hbWU6IGJvZHkubmFtZSxcbiAgICAgICAgICAgIHNwZWNpYWx0eTogYm9keS5zcGVjaWFsdHksXG4gICAgICAgICAgICBhZGRyZXNzOiBib2R5LmFkZHJlc3MsXG4gICAgICAgICAgICB1cmw6IGJvZHkudXJsLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246IGJvZHkuZGVzY3JpcHRpb25cbiAgICAgICAgICB9O1xuICAgICAgICB9O1xuICAgICAgICBgKVxuICAgIH0pO1xuXG4vLyBSb2xlIFxuICAgIGNvbnN0IGxpc3Rfcm9sZSA9IG5ldyBpYW0uUm9sZSh0aGlzLCAnTGlzdExhbWJkYVJvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnbGFtYmRhLmFtYXpvbmF3cy5jb20nKVxuICAgIH0pO1xuICAgIGxpc3Rfcm9sZS5hZGRNYW5hZ2VkUG9saWN5KHtcbiAgICAgIG1hbmFnZWRQb2xpY3lBcm46ICdhcm46YXdzOmlhbTo6YXdzOnBvbGljeS9zZXJ2aWNlLXJvbGUvQVdTTGFtYmRhQmFzaWNFeGVjdXRpb25Sb2xlJ1xuICAgIH0pXG5cbiAgICBjb25zdCBsaXN0X3BvbGljeSA9IG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGFjdGlvbnM6IFsgXCJkeW5hbW9kYjpCYXRjaEdldEl0ZW1cIixcbiAgICAgIFwiZHluYW1vZGI6R2V0UmVjb3Jkc1wiLFxuICAgICAgXCJkeW5hbW9kYjpHZXRTaGFyZEl0ZXJhdG9yXCIsXG4gICAgICBcImR5bmFtb2RiOlF1ZXJ5XCIsXG4gICAgICBcImR5bmFtb2RiOkdldEl0ZW1cIixcbiAgICAgIFwiZHluYW1vZGI6U2NhblwiLFxuICAgICAgXCJkeW5hbW9kYjpCYXRjaFdyaXRlSXRlbVwiLFxuICAgICAgXCJkeW5hbW9kYjpQdXRJdGVtXCIsXG4gICAgICBcImR5bmFtb2RiOlVwZGF0ZUl0ZW1cIixcbiAgICAgIFwiZHluYW1vZGI6RGVsZXRlSXRlbVwiXSxcbiAgICAgIHJlc291cmNlczogWyAnKicgXSxcbiAgICB9KVxuXG4gICAgbGlzdF9yb2xlLmFkZFRvUG9saWN5KGxpc3RfcG9saWN5KVxuICAgIENyZWF0ZUZ1bmN0aW9uTW9uaXRvck9wZXJhdG9yLmFkZEVudmlyb25tZW50KFwiVEFCTEVfTkFNRVwiLCB0YWJsZS50YWJsZU5hbWUpO1xuXG4gLy8gUm9sZSBcbiAgICBjb25zdCBzY2FuX3JvbGUgPSBuZXcgaWFtLlJvbGUodGhpcywgJ1NjYW5MYW1iZGFSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2xhbWJkYS5hbWF6b25hd3MuY29tJylcbiAgICAgIH0pO1xuICAgICAgc2Nhbl9yb2xlLmFkZE1hbmFnZWRQb2xpY3koe1xuICAgICAgbWFuYWdlZFBvbGljeUFybjogJ2Fybjphd3M6aWFtOjphd3M6cG9saWN5L3NlcnZpY2Utcm9sZS9BV1NMYW1iZGFCYXNpY0V4ZWN1dGlvblJvbGUnXG4gICAgICB9KVxuXG4gICAgY29uc3Qgc2Nhbl9wb2xpY3kgPSBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICBhY3Rpb25zOiBbIFwiZHluYW1vZGI6QmF0Y2hHZXRJdGVtXCIsXG4gICAgICBcImR5bmFtb2RiOkdldFJlY29yZHNcIixcbiAgICAgIFwiZHluYW1vZGI6R2V0U2hhcmRJdGVyYXRvclwiLFxuICAgICAgXCJkeW5hbW9kYjpRdWVyeVwiLFxuICAgICAgXCJkeW5hbW9kYjpTY2FuXCIsXG4gICAgICBcImR5bmFtb2RiOkdldEl0ZW1cIl0sXG4gICAgICByZXNvdXJjZXM6IFsgJyonIF0sXG4gICAgfSlcblxuICAgc2Nhbl9yb2xlLmFkZFRvUG9saWN5KHNjYW5fcG9saWN5KTtcblxuLy8gTGFtYmRhIC0gU2NhbkZ1bmN0aW9uTW9uaXRvck9wZXJhdG9yXG4gICAgY29uc3QgU2NhbkZ1bmN0aW9uTW9uaXRvck9wZXJhdG9yID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnU2NhbkZ1bmN0aW9uTW9uaXRvck9wZXJhdG9yJywge1xuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzEyX1gsXG4gICAgICBoYW5kbGVyOiAnaW5kZXgubGFtYmRhX2hhbmRsZXInLFxuICAgICAgcm9sZTogc2Nhbl9yb2xlLFxuICAgICAgZnVuY3Rpb25OYW1lIDogJ1NjYW5GdW5jdGlvbk1vbml0b3JPcGVyYXRvcicsIFxuICAgICAgY29kZSA6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoYCd1c2Ugc3RyaWN0JztcbiAgICAgIGNvbnN0IEFXUyA9IHJlcXVpcmUoJ2F3cy1zZGsnKTtcbiAgICAgIGNvbnN0IGRvY0NsaWVudCA9IG5ldyBBV1MuRHluYW1vREIuRG9jdW1lbnRDbGllbnQoKTtcbiAgICAgIGNvbnN0IHRhYmxlTmFtZSA9IHByb2Nlc3MuZW52LlRBQkxFX05BTUU7XG4gICAgICBleHBvcnRzLmxhbWJkYV9oYW5kbGVyID0gKGV2ZW50LCBjb250ZXh0LCBjYWxsYmFjaykgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnUmVjZWl2ZWQgZXZlbnQ6JywgSlNPTi5zdHJpbmdpZnkoZXZlbnQsIG51bGwsIDIpKTtcbiAgICAgICAgdmFyIHBhcmFtcyA9IHtcbiAgICAgICAgICBUYWJsZU5hbWU6IHRhYmxlTmFtZVxuICAgICAgICB9O1xuICAgICAgICBkb2NDbGllbnQuc2NhbihwYXJhbXMsIGZ1bmN0aW9uKGVyciwgZGF0YSkge1xuICAgICAgICAgIGlmIChlcnIpIGNhbGxiYWNrKGVycilcbiAgICAgICAgICBjYWxsYmFjayhudWxsLCB7XG4gICAgICAgICAgICBzdGF0dXNDb2RlOiAyMDAsXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShkYXRhLkl0ZW1zKVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH07YClcbiAgICB9KTtcbiAgICBTY2FuRnVuY3Rpb25Nb25pdG9yT3BlcmF0b3IuYWRkRW52aXJvbm1lbnQoXCJUQUJMRV9OQU1FXCIsIHRhYmxlLnRhYmxlTmFtZSk7XG5cbi8vIEFQSSBHYXRld2F5IC0gQ3JlYXRlUmVzdEFwaU1vbml0b3JPcGVyYXRvclxuICAgIGNvbnN0IGNyZWF0ZV9hcGkgPSBuZXcgYXBpZ2F0ZXdheS5MYW1iZGFSZXN0QXBpKHRoaXMsICdDcmVhdGVSZXN0QXBpTW9uaXRvck9wZXJhdG9yJywge1xuICAgICAgZGVzY3JpcHRpb246ICdDcmVhdGUgUmVzdCBBUEknLFxuICAgICAgaGFuZGxlcjogQ3JlYXRlRnVuY3Rpb25Nb25pdG9yT3BlcmF0b3IsXG4gICAgICBwcm94eTogZmFsc2UsXG4gICAgICBkZXBsb3lPcHRpb25zOiB7XG4gICAgICAgIGxvZ2dpbmdMZXZlbCA6IGFwaWdhdGV3YXkuTWV0aG9kTG9nZ2luZ0xldmVsLklORk8sXG4gICAgICAgIGRhdGFUcmFjZUVuYWJsZWQ6IHRydWVcbiAgICAgIH0sXG4gICAgICBlbmRwb2ludENvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgdHlwZXM6IFsgYXBpZ2F0ZXdheS5FbmRwb2ludFR5cGUuUkVHSU9OQUxdLFxuICAgICAgfVxuICAgIH0pO1xuICAgIGNyZWF0ZV9hcGkucm9vdC5hZGRNZXRob2QoJ0FOWScpOyAgXG4gICAgY29uc3QgY3JlYXRlX2l0ZW1zID0gY3JlYXRlX2FwaS5yb290LmFkZFJlc291cmNlKCd7cHJveHkrfScpLmFkZE1ldGhvZCgnQU5ZJyk7XG4gICAgXG4vLyBBUEkgR2F0ZXdheSAtIExpc3RSZXN0QXBpTW9uaXRvck9wZXJhdG9yXG4gICAgY29uc3QgbGlzdF9hcGkgPSBuZXcgYXBpZ2F0ZXdheS5MYW1iZGFSZXN0QXBpKHRoaXMsICdMaXN0UmVzdEFwaU1vbml0b3JPcGVyYXRvcicsIHtcbiAgICAgIGRlc2NyaXB0aW9uOiAnTGlzdCBSZXN0IEFQSScsXG4gICAgICBoYW5kbGVyOiBTY2FuRnVuY3Rpb25Nb25pdG9yT3BlcmF0b3IsXG4gICAgICBwcm94eTogZmFsc2UsXG4gICAgICBkZXBsb3lPcHRpb25zOiB7XG4gICAgICAgIGxvZ2dpbmdMZXZlbCA6IGFwaWdhdGV3YXkuTWV0aG9kTG9nZ2luZ0xldmVsLklORk8sXG4gICAgICAgIGRhdGFUcmFjZUVuYWJsZWQ6IHRydWVcbiAgICAgIH0sXG4gICAgICBlbmRwb2ludENvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgdHlwZXM6IFsgYXBpZ2F0ZXdheS5FbmRwb2ludFR5cGUuUkVHSU9OQUxdLFxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgbGlzdF9hcGkucm9vdC5hZGRNZXRob2QoJ0FOWScpO1xuICAgIGNvbnN0IGxpc3RfaXRlbXMgPSBsaXN0X2FwaS5yb290LmFkZFJlc291cmNlKCd7cHJveHkrfScpLmFkZE1ldGhvZCgnQU5ZJyk7XG4gIH1cbn0iXX0=