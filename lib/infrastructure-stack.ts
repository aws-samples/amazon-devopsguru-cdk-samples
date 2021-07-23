import * as cdk from '@aws-cdk/core';
import dynamodb = require('@aws-cdk/aws-dynamodb');
import { AttributeType } from '@aws-cdk/aws-dynamodb';
import lambda = require('@aws-cdk/aws-lambda');
import apigateway = require('@aws-cdk/aws-apigateway');
import iam = require('@aws-cdk/aws-iam');

export class CdkInfrastructureStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
      super(scope, id, props);
    
// DDB Table
    const table = new dynamodb.Table(this, 'DdbTable', {
        tableName : 'DdbTable',
        partitionKey: { name : 'name', type: AttributeType.STRING},
        readCapacity : 1,
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
        functionName : 'CreateFunctionMonitorOperator', 
        code : lambda.Code.fromInline(`'use strict';
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
    })

    const list_policy = new iam.PolicyStatement({
      actions: [ "dynamodb:BatchGetItem",
      "dynamodb:GetRecords",
      "dynamodb:GetShardIterator",
      "dynamodb:Query",
      "dynamodb:GetItem",
      "dynamodb:Scan",
      "dynamodb:BatchWriteItem",
      "dynamodb:PutItem",
      "dynamodb:UpdateItem",
      "dynamodb:DeleteItem"],
      resources: [ '*' ],
    })

    list_role.addToPolicy(list_policy)
    CreateFunctionMonitorOperator.addEnvironment("TABLE_NAME", table.tableName);

 // Role 
    const scan_role = new iam.Role(this, 'ScanLambdaRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com')
      });
      scan_role.addManagedPolicy({
      managedPolicyArn: 'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole'
      })

    const scan_policy = new iam.PolicyStatement({
      actions: [ "dynamodb:BatchGetItem",
      "dynamodb:GetRecords",
      "dynamodb:GetShardIterator",
      "dynamodb:Query",
      "dynamodb:Scan",
      "dynamodb:GetItem"],
      resources: [ '*' ],
    })

   scan_role.addToPolicy(scan_policy);

// Lambda - ScanFunctionMonitorOperator
    const ScanFunctionMonitorOperator = new lambda.Function(this, 'ScanFunctionMonitorOperator', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.lambda_handler',
      role: scan_role,
      functionName : 'ScanFunctionMonitorOperator', 
      code : lambda.Code.fromInline(`'use strict';
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
        loggingLevel : apigateway.MethodLoggingLevel.INFO,
        dataTraceEnabled: true
      },
      endpointConfiguration: {
        types: [ apigateway.EndpointType.REGIONAL],
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
        loggingLevel : apigateway.MethodLoggingLevel.INFO,
        dataTraceEnabled: true
      },
      endpointConfiguration: {
        types: [ apigateway.EndpointType.REGIONAL],
      }
    });

    list_api.root.addMethod('ANY');
    const list_items = list_api.root.addResource('{proxy+}').addMethod('ANY');
  }
}