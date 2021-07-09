import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import { ManagedPolicy } from '@aws-cdk/aws-iam';

export class CdkStackSetExecutionRole extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);  

     const admin_account_id = new cdk.CfnParameter(this, 'AdministratorAccountId',{
      description : 'Administrator Account Id',
    });

    const execution_role = new iam.Role(this, 'ExecutionRole', {
        roleName: 'AWSCloudFormationStackSetExecutionRole',
        assumedBy: new iam.AccountPrincipal(admin_account_id.valueAsString),
        path: '/'
      });
      execution_role.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName("AdministratorAccess"))
    }
}