import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';

export class CdkStackSetAdminRole extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);  
    const admin_role = new iam.Role(this, 'AdminRole', {
        roleName: 'AWSCloudFormationStackSetAdministrationRole',
        assumedBy: new iam.ServicePrincipal('cloudformation.amazonaws.com'),
        path: '/'
      });
    const admin_policy = new iam.Policy(this,'AdminPolicy', {
        policyName: 'AssumeRole-AWSCloudFormationStackSetExecutionRole',
        statements: [
            new iam.PolicyStatement({
                actions: ['sts:AssumeRole'],
                resources: ['arn:*:iam::*:role/AWSCloudFormationStackSetExecutionRole'],
                effect: iam.Effect.ALLOW, 
            })
        ]
        })
    admin_role.attachInlinePolicy(admin_policy)
    }
}