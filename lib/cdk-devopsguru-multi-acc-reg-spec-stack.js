"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdkDevopsGuruStackMultiAccRegSpecStacks = void 0;
const cdk = require("@aws-cdk/core");
const stackset = require("@aws-cdk/aws-cloudformation");
class CdkDevopsGuruStackMultiAccRegSpecStacks extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const admin_account_id = new cdk.CfnParameter(this, 'AdministratorAccountId', {
            description: 'Administrator Account Id',
        });
        const target_account_id = new cdk.CfnParameter(this, 'TargetAccountId', {
            description: 'Target Account Id',
        });
        const region_id = new cdk.CfnParameter(this, 'RegionIds', {
            type: 'List<String>',
            description: 'Region Ids to deploy StackSet',
        });
        new stackset.CfnStackSet(this, 'DevopsGuruStackSetSpecStacks', {
            permissionModel: 'SELF_MANAGED',
            stackSetName: 'EnableDevOpsGuruStackSetMultiAccRegSpecSacks',
            description: 'CDK Stack Instance to Enable DevOpsGuru for Specific Stacks',
            stackInstancesGroup: [
                {
                    deploymentTargets: {
                        accounts: [admin_account_id.valueAsString, target_account_id.valueAsString],
                    },
                    regions: region_id.valueAsList,
                }
            ],
            operationPreferences: {
                failureToleranceCount: 0,
                maxConcurrentCount: 1
            },
            templateBody: `
        Resources:
          DevOpsGuruMonitoring:
            Type: AWS::DevOpsGuru::ResourceCollection
            Properties:
              ResourceCollectionFilter:
                CloudFormation:
                  StackNames: ['CdkInfrastructureStack']

          DevOpsGuruTopic: 
            Type: AWS::SNS::Topic
            Properties: 
              TopicName: devops-guru-spec-stack
              Subscription:
                - Endpoint: gikwadr@amazon.com
                  Protocol: email
          
          DevOpsGuruNotification:
            Type: AWS::DevOpsGuru::NotificationChannel
            Properties:
              Config:
                Sns:
                  TopicArn: !Ref DevOpsGuruTopic`
        });
    }
}
exports.CdkDevopsGuruStackMultiAccRegSpecStacks = CdkDevopsGuruStackMultiAccRegSpecStacks;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLWRldm9wc2d1cnUtbXVsdGktYWNjLXJlZy1zcGVjLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2RrLWRldm9wc2d1cnUtbXVsdGktYWNjLXJlZy1zcGVjLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFDQUFxQztBQU9yQyx3REFBeUQ7QUFJekQsTUFBYSx1Q0FBd0MsU0FBUSxHQUFHLENBQUMsS0FBSztJQUNwRSxZQUFZLEtBQW9CLEVBQUUsRUFBVSxFQUFFLEtBQXNCO1FBQ2xFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSx3QkFBd0IsRUFBQztZQUMzRSxXQUFXLEVBQUcsMEJBQTBCO1NBQ3pDLENBQUMsQ0FBQztRQUVILE1BQU0saUJBQWlCLEdBQUcsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBQztZQUNyRSxXQUFXLEVBQUcsbUJBQW1CO1NBQ2xDLENBQUMsQ0FBQztRQUVILE1BQU0sU0FBUyxHQUFHLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFDO1lBQ3ZELElBQUksRUFBRSxjQUFjO1lBQ3BCLFdBQVcsRUFBRywrQkFBK0I7U0FDOUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSw4QkFBOEIsRUFBRTtZQUM3RCxlQUFlLEVBQUcsY0FBYztZQUNoQyxZQUFZLEVBQUcsOENBQThDO1lBQzdELFdBQVcsRUFBRyw2REFBNkQ7WUFDM0UsbUJBQW1CLEVBQUU7Z0JBQ3JCO29CQUNFLGlCQUFpQixFQUFFO3dCQUNuQixRQUFRLEVBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLEVBQUMsaUJBQWlCLENBQUMsYUFBYSxDQUFDO3FCQUMxRTtvQkFDRCxPQUFPLEVBQUUsU0FBUyxDQUFDLFdBQVc7aUJBQy9CO2FBQUM7WUFDRixvQkFBb0IsRUFBRTtnQkFDcEIscUJBQXFCLEVBQUUsQ0FBQztnQkFDeEIsa0JBQWtCLEVBQUUsQ0FBQzthQUN0QjtZQUNELFlBQVksRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztpREFzQjZCO1NBQzlDLENBQUMsQ0FBQztJQUNILENBQUM7Q0FDRjtBQXpERCwwRkF5REMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgZGV2b3BzZ3VydSA9IHJlcXVpcmUoJ0Bhd3MtY2RrL2F3cy1kZXZvcHNndXJ1Jyk7XG5pbXBvcnQgeyBjb25maWcgfSBmcm9tICdwcm9jZXNzJztcbmltcG9ydCAqIGFzIHNucyBmcm9tICdAYXdzLWNkay9hd3Mtc25zJztcbmltcG9ydCAqIGFzIGttcyBmcm9tIFwiQGF3cy1jZGsvYXdzLWttc1wiO1xuaW1wb3J0ICogYXMgc3Vic2NyaXB0aW9ucyBmcm9tICdAYXdzLWNkay9hd3Mtc25zLXN1YnNjcmlwdGlvbnMnO1xuaW1wb3J0ICogYXMgQ2ZuUGFyYW1ldGVyIGZyb20gJ0Bhd3MtY2RrL2F3cy1zc20nO1xuaW1wb3J0IHN0YWNrc2V0ID0gcmVxdWlyZSgnQGF3cy1jZGsvYXdzLWNsb3VkZm9ybWF0aW9uJyk7XG5pbXBvcnQgeyBjcmVhdGUgfSBmcm9tICdkb21haW4nO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuXG5leHBvcnQgY2xhc3MgQ2RrRGV2b3BzR3VydVN0YWNrTXVsdGlBY2NSZWdTcGVjU3RhY2tzIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTsgICAgXG5cbiAgICBjb25zdCBhZG1pbl9hY2NvdW50X2lkID0gbmV3IGNkay5DZm5QYXJhbWV0ZXIodGhpcywgJ0FkbWluaXN0cmF0b3JBY2NvdW50SWQnLHtcbiAgICAgIGRlc2NyaXB0aW9uIDogJ0FkbWluaXN0cmF0b3IgQWNjb3VudCBJZCcsXG4gICAgfSk7XG5cbiAgICBjb25zdCB0YXJnZXRfYWNjb3VudF9pZCA9IG5ldyBjZGsuQ2ZuUGFyYW1ldGVyKHRoaXMsICdUYXJnZXRBY2NvdW50SWQnLHtcbiAgICAgIGRlc2NyaXB0aW9uIDogJ1RhcmdldCBBY2NvdW50IElkJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IHJlZ2lvbl9pZCA9IG5ldyBjZGsuQ2ZuUGFyYW1ldGVyKHRoaXMsICdSZWdpb25JZHMnLHtcbiAgICAgIHR5cGU6ICdMaXN0PFN0cmluZz4nLFxuICAgICAgZGVzY3JpcHRpb24gOiAnUmVnaW9uIElkcyB0byBkZXBsb3kgU3RhY2tTZXQnLFxuICAgIH0pO1xuXG4gICAgbmV3IHN0YWNrc2V0LkNmblN0YWNrU2V0KHRoaXMsICdEZXZvcHNHdXJ1U3RhY2tTZXRTcGVjU3RhY2tzJywge1xuICAgICAgcGVybWlzc2lvbk1vZGVsIDogJ1NFTEZfTUFOQUdFRCcsXG4gICAgICBzdGFja1NldE5hbWUgOiAnRW5hYmxlRGV2T3BzR3VydVN0YWNrU2V0TXVsdGlBY2NSZWdTcGVjU2Fja3MnLFxuICAgICAgZGVzY3JpcHRpb24gOiAnQ0RLIFN0YWNrIEluc3RhbmNlIHRvIEVuYWJsZSBEZXZPcHNHdXJ1IGZvciBTcGVjaWZpYyBTdGFja3MnLFxuICAgICAgc3RhY2tJbnN0YW5jZXNHcm91cDogW1xuICAgICAge1xuICAgICAgICBkZXBsb3ltZW50VGFyZ2V0czoge1xuICAgICAgICBhY2NvdW50cyA6IFthZG1pbl9hY2NvdW50X2lkLnZhbHVlQXNTdHJpbmcsdGFyZ2V0X2FjY291bnRfaWQudmFsdWVBc1N0cmluZ10sXG4gICAgICAgIH0sXG4gICAgICAgIHJlZ2lvbnM6IHJlZ2lvbl9pZC52YWx1ZUFzTGlzdCxcbiAgICAgIH1dLFxuICAgICAgb3BlcmF0aW9uUHJlZmVyZW5jZXM6IHtcbiAgICAgICAgZmFpbHVyZVRvbGVyYW5jZUNvdW50OiAwLFxuICAgICAgICBtYXhDb25jdXJyZW50Q291bnQ6IDFcbiAgICAgIH0sXG4gICAgICB0ZW1wbGF0ZUJvZHk6IGBcbiAgICAgICAgUmVzb3VyY2VzOlxuICAgICAgICAgIERldk9wc0d1cnVNb25pdG9yaW5nOlxuICAgICAgICAgICAgVHlwZTogQVdTOjpEZXZPcHNHdXJ1OjpSZXNvdXJjZUNvbGxlY3Rpb25cbiAgICAgICAgICAgIFByb3BlcnRpZXM6XG4gICAgICAgICAgICAgIFJlc291cmNlQ29sbGVjdGlvbkZpbHRlcjpcbiAgICAgICAgICAgICAgICBDbG91ZEZvcm1hdGlvbjpcbiAgICAgICAgICAgICAgICAgIFN0YWNrTmFtZXM6IFsnQ2RrSW5mcmFzdHJ1Y3R1cmVTdGFjayddXG5cbiAgICAgICAgICBEZXZPcHNHdXJ1VG9waWM6IFxuICAgICAgICAgICAgVHlwZTogQVdTOjpTTlM6OlRvcGljXG4gICAgICAgICAgICBQcm9wZXJ0aWVzOiBcbiAgICAgICAgICAgICAgVG9waWNOYW1lOiBkZXZvcHMtZ3VydS1zcGVjLXN0YWNrXG4gICAgICAgICAgICAgIFN1YnNjcmlwdGlvbjpcbiAgICAgICAgICAgICAgICAtIEVuZHBvaW50OiBnaWt3YWRyQGFtYXpvbi5jb21cbiAgICAgICAgICAgICAgICAgIFByb3RvY29sOiBlbWFpbFxuICAgICAgICAgIFxuICAgICAgICAgIERldk9wc0d1cnVOb3RpZmljYXRpb246XG4gICAgICAgICAgICBUeXBlOiBBV1M6OkRldk9wc0d1cnU6Ok5vdGlmaWNhdGlvbkNoYW5uZWxcbiAgICAgICAgICAgIFByb3BlcnRpZXM6XG4gICAgICAgICAgICAgIENvbmZpZzpcbiAgICAgICAgICAgICAgICBTbnM6XG4gICAgICAgICAgICAgICAgICBUb3BpY0FybjogIVJlZiBEZXZPcHNHdXJ1VG9waWNgXG4gIH0pO1xuICB9XG59Il19