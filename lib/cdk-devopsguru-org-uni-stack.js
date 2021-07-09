"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdkDevopsguruStackOrgUnit = void 0;
const cdk = require("@aws-cdk/core");
const stackset = require("@aws-cdk/aws-cloudformation");
class CdkDevopsguruStackOrgUnit extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const ou_ids = new cdk.CfnParameter(this, 'OrganizationalUnitIds', {
            type: 'List<String>',
            description: 'Organizational Unit Ids to deploy StackSet',
        });
        const region_id = new cdk.CfnParameter(this, 'RegionIds', {
            type: 'List<String>',
            description: 'Region Ids to deploy StackSet',
        });
        new stackset.CfnStackSet(this, 'DevopsGuruStackSet', {
            permissionModel: 'SERVICE_MANAGED',
            stackSetName: 'EnableDevOpsGuruStackSetOrgUni',
            description: 'CDK Stack Instance to Enable DevOpsGuru across Organization Units',
            stackInstancesGroup: [
                {
                    regions: region_id.valueAsList,
                    deploymentTargets: {
                        organizationalUnitIds: ou_ids.valueAsList,
                    },
                }
            ],
            operationPreferences: {
                failureToleranceCount: 0,
                maxConcurrentCount: 1
            },
            autoDeployment: {
                enabled: true,
                retainStacksOnAccountRemoval: true,
            },
            templateBody: `
        Resources:
          DevOpsGuruMonitoring:
            Type: AWS::DevOpsGuru::ResourceCollection
            Properties:
              ResourceCollectionFilter:
                CloudFormation:
                  StackNames: ['*']

          DevOpsGuruTopic: 
            Type: AWS::SNS::Topic
            Properties: 
              TopicName: devops-guru-ou
              Subscription:
                - Endpoint: abc@xyz.com
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
exports.CdkDevopsguruStackOrgUnit = CdkDevopsguruStackOrgUnit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLWRldm9wc2d1cnUtb3JnLXVuaS1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNkay1kZXZvcHNndXJ1LW9yZy11bmktc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUNBQXFDO0FBT3JDLHdEQUF5RDtBQUl6RCxNQUFhLHlCQUEwQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ3RELFlBQVksS0FBb0IsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDbEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxNQUFNLEdBQUcsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSx1QkFBdUIsRUFBQztZQUNoRSxJQUFJLEVBQUUsY0FBYztZQUNwQixXQUFXLEVBQUcsNENBQTRDO1NBQzNELENBQUMsQ0FBQztRQUVELE1BQU0sU0FBUyxHQUFHLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFDO1lBQ3ZELElBQUksRUFBRSxjQUFjO1lBQ3BCLFdBQVcsRUFBRywrQkFBK0I7U0FDOUMsQ0FBQyxDQUFDO1FBRUwsSUFBSSxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxvQkFBb0IsRUFBRTtZQUNuRCxlQUFlLEVBQUcsaUJBQWlCO1lBQ25DLFlBQVksRUFBRyxnQ0FBZ0M7WUFDL0MsV0FBVyxFQUFHLG1FQUFtRTtZQUNqRixtQkFBbUIsRUFBRTtnQkFDckI7b0JBQ0UsT0FBTyxFQUFFLFNBQVMsQ0FBQyxXQUFXO29CQUM5QixpQkFBaUIsRUFBRTt3QkFDbEIscUJBQXFCLEVBQUUsTUFBTSxDQUFDLFdBQVc7cUJBQ3pDO2lCQUNGO2FBQUM7WUFDRixvQkFBb0IsRUFBRTtnQkFDcEIscUJBQXFCLEVBQUUsQ0FBQztnQkFDeEIsa0JBQWtCLEVBQUUsQ0FBQzthQUN0QjtZQUNELGNBQWMsRUFBRTtnQkFDZCxPQUFPLEVBQUUsSUFBSTtnQkFDYiw0QkFBNEIsRUFBRSxJQUFJO2FBQ25DO1lBQ0QsWUFBWSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2lEQXNCNkI7U0FDOUMsQ0FBQyxDQUFDO0lBQ0gsQ0FBQztDQUNGO0FBMURELDhEQTBEQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCBkZXZvcHNndXJ1ID0gcmVxdWlyZSgnQGF3cy1jZGsvYXdzLWRldm9wc2d1cnUnKTtcbmltcG9ydCB7IGNvbmZpZyB9IGZyb20gJ3Byb2Nlc3MnO1xuaW1wb3J0ICogYXMgc25zIGZyb20gJ0Bhd3MtY2RrL2F3cy1zbnMnO1xuaW1wb3J0ICogYXMga21zIGZyb20gXCJAYXdzLWNkay9hd3Mta21zXCI7XG5pbXBvcnQgKiBhcyBzdWJzY3JpcHRpb25zIGZyb20gJ0Bhd3MtY2RrL2F3cy1zbnMtc3Vic2NyaXB0aW9ucyc7XG5pbXBvcnQgKiBhcyBDZm5QYXJhbWV0ZXIgZnJvbSAnQGF3cy1jZGsvYXdzLXNzbSc7XG5pbXBvcnQgc3RhY2tzZXQgPSByZXF1aXJlKCdAYXdzLWNkay9hd3MtY2xvdWRmb3JtYXRpb24nKTtcbmltcG9ydCB7IGNyZWF0ZSB9IGZyb20gJ2RvbWFpbic7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5cbmV4cG9ydCBjbGFzcyBDZGtEZXZvcHNndXJ1U3RhY2tPcmdVbml0IGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTsgICAgXG5cbiAgICBjb25zdCBvdV9pZHMgPSBuZXcgY2RrLkNmblBhcmFtZXRlcih0aGlzLCAnT3JnYW5pemF0aW9uYWxVbml0SWRzJyx7XG4gICAgICB0eXBlOiAnTGlzdDxTdHJpbmc+JyxcbiAgICAgIGRlc2NyaXB0aW9uIDogJ09yZ2FuaXphdGlvbmFsIFVuaXQgSWRzIHRvIGRlcGxveSBTdGFja1NldCcsXG4gICAgfSk7XG5cbiAgICAgIGNvbnN0IHJlZ2lvbl9pZCA9IG5ldyBjZGsuQ2ZuUGFyYW1ldGVyKHRoaXMsICdSZWdpb25JZHMnLHtcbiAgICAgICAgdHlwZTogJ0xpc3Q8U3RyaW5nPicsXG4gICAgICAgIGRlc2NyaXB0aW9uIDogJ1JlZ2lvbiBJZHMgdG8gZGVwbG95IFN0YWNrU2V0JyxcbiAgICAgIH0pO1xuXG4gICAgbmV3IHN0YWNrc2V0LkNmblN0YWNrU2V0KHRoaXMsICdEZXZvcHNHdXJ1U3RhY2tTZXQnLCB7XG4gICAgICBwZXJtaXNzaW9uTW9kZWwgOiAnU0VSVklDRV9NQU5BR0VEJyxcbiAgICAgIHN0YWNrU2V0TmFtZSA6ICdFbmFibGVEZXZPcHNHdXJ1U3RhY2tTZXRPcmdVbmknLFxuICAgICAgZGVzY3JpcHRpb24gOiAnQ0RLIFN0YWNrIEluc3RhbmNlIHRvIEVuYWJsZSBEZXZPcHNHdXJ1IGFjcm9zcyBPcmdhbml6YXRpb24gVW5pdHMnLFxuICAgICAgc3RhY2tJbnN0YW5jZXNHcm91cDogW1xuICAgICAge1xuICAgICAgICByZWdpb25zOiByZWdpb25faWQudmFsdWVBc0xpc3QsXG4gICAgICAgIGRlcGxveW1lbnRUYXJnZXRzOiB7XG4gICAgICAgICBvcmdhbml6YXRpb25hbFVuaXRJZHM6IG91X2lkcy52YWx1ZUFzTGlzdCxcbiAgICAgICAgfSxcbiAgICAgIH1dLFxuICAgICAgb3BlcmF0aW9uUHJlZmVyZW5jZXM6IHtcbiAgICAgICAgZmFpbHVyZVRvbGVyYW5jZUNvdW50OiAwLFxuICAgICAgICBtYXhDb25jdXJyZW50Q291bnQ6IDFcbiAgICAgIH0sXG4gICAgICBhdXRvRGVwbG95bWVudDoge1xuICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICByZXRhaW5TdGFja3NPbkFjY291bnRSZW1vdmFsOiB0cnVlLFxuICAgICAgfSxcbiAgICAgIHRlbXBsYXRlQm9keTogYFxuICAgICAgICBSZXNvdXJjZXM6XG4gICAgICAgICAgRGV2T3BzR3VydU1vbml0b3Jpbmc6XG4gICAgICAgICAgICBUeXBlOiBBV1M6OkRldk9wc0d1cnU6OlJlc291cmNlQ29sbGVjdGlvblxuICAgICAgICAgICAgUHJvcGVydGllczpcbiAgICAgICAgICAgICAgUmVzb3VyY2VDb2xsZWN0aW9uRmlsdGVyOlxuICAgICAgICAgICAgICAgIENsb3VkRm9ybWF0aW9uOlxuICAgICAgICAgICAgICAgICAgU3RhY2tOYW1lczogWycqJ11cblxuICAgICAgICAgIERldk9wc0d1cnVUb3BpYzogXG4gICAgICAgICAgICBUeXBlOiBBV1M6OlNOUzo6VG9waWNcbiAgICAgICAgICAgIFByb3BlcnRpZXM6IFxuICAgICAgICAgICAgICBUb3BpY05hbWU6IGRldm9wcy1ndXJ1LW91XG4gICAgICAgICAgICAgIFN1YnNjcmlwdGlvbjpcbiAgICAgICAgICAgICAgICAtIEVuZHBvaW50OiBhYmNAeHl6LmNvbVxuICAgICAgICAgICAgICAgICAgUHJvdG9jb2w6IGVtYWlsXG4gICAgICAgICAgXG4gICAgICAgICAgRGV2T3BzR3VydU5vdGlmaWNhdGlvbjpcbiAgICAgICAgICAgIFR5cGU6IEFXUzo6RGV2T3BzR3VydTo6Tm90aWZpY2F0aW9uQ2hhbm5lbFxuICAgICAgICAgICAgUHJvcGVydGllczpcbiAgICAgICAgICAgICAgQ29uZmlnOlxuICAgICAgICAgICAgICAgIFNuczpcbiAgICAgICAgICAgICAgICAgIFRvcGljQXJuOiAhUmVmIERldk9wc0d1cnVUb3BpY2BcbiAgfSk7XG4gIH1cbn0iXX0=