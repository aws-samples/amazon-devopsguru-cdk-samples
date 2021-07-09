"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdkStackSetAdminRole = void 0;
const cdk = require("@aws-cdk/core");
const iam = require("@aws-cdk/aws-iam");
class CdkStackSetAdminRole extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const admin_role = new iam.Role(this, 'AdminRole', {
            roleName: 'AWSCloudFormationStackSetAdministrationRole',
            assumedBy: new iam.ServicePrincipal('cloudformation.amazonaws.com'),
            path: '/'
        });
        const admin_policy = new iam.Policy(this, 'AdminPolicy', {
            policyName: 'AssumeRole-AWSCloudFormationStackSetExecutionRole',
            statements: [
                new iam.PolicyStatement({
                    actions: ['sts:AssumeRole'],
                    resources: ['arn:*:iam::*:role/AWSCloudFormationStackSetExecutionRole'],
                    effect: iam.Effect.ALLOW,
                })
            ]
        });
        admin_role.attachInlinePolicy(admin_policy);
    }
}
exports.CdkStackSetAdminRole = CdkStackSetAdminRole;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLXN0YWNrc2V0LWFkbWluLXJvbGUtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjZGstc3RhY2tzZXQtYWRtaW4tcm9sZS1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxQ0FBcUM7QUFDckMsd0NBQXdDO0FBRXhDLE1BQWEsb0JBQXFCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDakQsWUFBWSxLQUFvQixFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUNsRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN4QixNQUFNLFVBQVUsR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRTtZQUMvQyxRQUFRLEVBQUUsNkNBQTZDO1lBQ3ZELFNBQVMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyw4QkFBOEIsQ0FBQztZQUNuRSxJQUFJLEVBQUUsR0FBRztTQUNWLENBQUMsQ0FBQztRQUNMLE1BQU0sWUFBWSxHQUFHLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUMsYUFBYSxFQUFFO1lBQ3BELFVBQVUsRUFBRSxtREFBbUQ7WUFDL0QsVUFBVSxFQUFFO2dCQUNSLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQztvQkFDcEIsT0FBTyxFQUFFLENBQUMsZ0JBQWdCLENBQUM7b0JBQzNCLFNBQVMsRUFBRSxDQUFDLDBEQUEwRCxDQUFDO29CQUN2RSxNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLO2lCQUMzQixDQUFDO2FBQ0w7U0FDQSxDQUFDLENBQUE7UUFDTixVQUFVLENBQUMsa0JBQWtCLENBQUMsWUFBWSxDQUFDLENBQUE7SUFDM0MsQ0FBQztDQUNKO0FBcEJELG9EQW9CQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcblxuZXhwb3J0IGNsYXNzIENka1N0YWNrU2V0QWRtaW5Sb2xlIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTsgIFxuICAgIGNvbnN0IGFkbWluX3JvbGUgPSBuZXcgaWFtLlJvbGUodGhpcywgJ0FkbWluUm9sZScsIHtcbiAgICAgICAgcm9sZU5hbWU6ICdBV1NDbG91ZEZvcm1hdGlvblN0YWNrU2V0QWRtaW5pc3RyYXRpb25Sb2xlJyxcbiAgICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2Nsb3VkZm9ybWF0aW9uLmFtYXpvbmF3cy5jb20nKSxcbiAgICAgICAgcGF0aDogJy8nXG4gICAgICB9KTtcbiAgICBjb25zdCBhZG1pbl9wb2xpY3kgPSBuZXcgaWFtLlBvbGljeSh0aGlzLCdBZG1pblBvbGljeScsIHtcbiAgICAgICAgcG9saWN5TmFtZTogJ0Fzc3VtZVJvbGUtQVdTQ2xvdWRGb3JtYXRpb25TdGFja1NldEV4ZWN1dGlvblJvbGUnLFxuICAgICAgICBzdGF0ZW1lbnRzOiBbXG4gICAgICAgICAgICBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgICAgICAgICAgYWN0aW9uczogWydzdHM6QXNzdW1lUm9sZSddLFxuICAgICAgICAgICAgICAgIHJlc291cmNlczogWydhcm46KjppYW06Oio6cm9sZS9BV1NDbG91ZEZvcm1hdGlvblN0YWNrU2V0RXhlY3V0aW9uUm9sZSddLFxuICAgICAgICAgICAgICAgIGVmZmVjdDogaWFtLkVmZmVjdC5BTExPVywgXG4gICAgICAgICAgICB9KVxuICAgICAgICBdXG4gICAgICAgIH0pXG4gICAgYWRtaW5fcm9sZS5hdHRhY2hJbmxpbmVQb2xpY3koYWRtaW5fcG9saWN5KVxuICAgIH1cbn0iXX0=