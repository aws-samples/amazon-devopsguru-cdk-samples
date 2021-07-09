"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdkDevopsGuruStackMultiAccReg = void 0;
const cdk = require("@aws-cdk/core");
const stackset = require("@aws-cdk/aws-cloudformation");
class CdkDevopsGuruStackMultiAccReg extends cdk.Stack {
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
        new stackset.CfnStackSet(this, 'DevopsGuruStackSet', {
            permissionModel: 'SELF_MANAGED',
            stackSetName: 'EnableDevOpsGuruStackSetMultiAccReg',
            description: 'CDK Stack Instance to Enable DevOpsGuru',
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
                  StackNames: ['*']

          DevOpsGuruTopic: 
            Type: AWS::SNS::Topic
            Properties: 
              TopicName: devops-guru-multi-acc
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
exports.CdkDevopsGuruStackMultiAccReg = CdkDevopsGuruStackMultiAccReg;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLWRldm9wc2d1cnUtbXVsdGktYWNjLXJlZy1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNkay1kZXZvcHNndXJ1LW11bHRpLWFjYy1yZWctc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUNBQXFDO0FBT3JDLHdEQUF5RDtBQUl6RCxNQUFhLDZCQUE4QixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQzFELFlBQVksS0FBb0IsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDbEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLHdCQUF3QixFQUFDO1lBQzNFLFdBQVcsRUFBRywwQkFBMEI7U0FDekMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFDO1lBQ3JFLFdBQVcsRUFBRyxtQkFBbUI7U0FDbEMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxTQUFTLEdBQUcsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUM7WUFDdkQsSUFBSSxFQUFFLGNBQWM7WUFDcEIsV0FBVyxFQUFHLCtCQUErQjtTQUM5QyxDQUFDLENBQUM7UUFFSCxJQUFJLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLG9CQUFvQixFQUFFO1lBQ25ELGVBQWUsRUFBRyxjQUFjO1lBQ2hDLFlBQVksRUFBRyxxQ0FBcUM7WUFDcEQsV0FBVyxFQUFHLHlDQUF5QztZQUN2RCxtQkFBbUIsRUFBRTtnQkFDckI7b0JBQ0UsaUJBQWlCLEVBQUU7d0JBQ25CLFFBQVEsRUFBRyxDQUFDLGdCQUFnQixDQUFDLGFBQWEsRUFBQyxpQkFBaUIsQ0FBQyxhQUFhLENBQUM7cUJBQzFFO29CQUNELE9BQU8sRUFBRSxTQUFTLENBQUMsV0FBVztpQkFDL0I7YUFBQztZQUNGLG9CQUFvQixFQUFFO2dCQUNwQixxQkFBcUIsRUFBRSxDQUFDO2dCQUN4QixrQkFBa0IsRUFBRSxDQUFDO2FBQ3RCO1lBQ0QsWUFBWSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2lEQXNCNkI7U0FDOUMsQ0FBQyxDQUFDO0lBQ0gsQ0FBQztDQUNGO0FBekRELHNFQXlEQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCBkZXZvcHNndXJ1ID0gcmVxdWlyZSgnQGF3cy1jZGsvYXdzLWRldm9wc2d1cnUnKTtcbmltcG9ydCB7IGNvbmZpZyB9IGZyb20gJ3Byb2Nlc3MnO1xuaW1wb3J0ICogYXMgc25zIGZyb20gJ0Bhd3MtY2RrL2F3cy1zbnMnO1xuaW1wb3J0ICogYXMga21zIGZyb20gXCJAYXdzLWNkay9hd3Mta21zXCI7XG5pbXBvcnQgKiBhcyBzdWJzY3JpcHRpb25zIGZyb20gJ0Bhd3MtY2RrL2F3cy1zbnMtc3Vic2NyaXB0aW9ucyc7XG5pbXBvcnQgKiBhcyBDZm5QYXJhbWV0ZXIgZnJvbSAnQGF3cy1jZGsvYXdzLXNzbSc7XG5pbXBvcnQgc3RhY2tzZXQgPSByZXF1aXJlKCdAYXdzLWNkay9hd3MtY2xvdWRmb3JtYXRpb24nKTtcbmltcG9ydCB7IGNyZWF0ZSB9IGZyb20gJ2RvbWFpbic7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5cbmV4cG9ydCBjbGFzcyBDZGtEZXZvcHNHdXJ1U3RhY2tNdWx0aUFjY1JlZyBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7ICAgIFxuXG4gICAgY29uc3QgYWRtaW5fYWNjb3VudF9pZCA9IG5ldyBjZGsuQ2ZuUGFyYW1ldGVyKHRoaXMsICdBZG1pbmlzdHJhdG9yQWNjb3VudElkJyx7XG4gICAgICBkZXNjcmlwdGlvbiA6ICdBZG1pbmlzdHJhdG9yIEFjY291bnQgSWQnLFxuICAgIH0pO1xuXG4gICAgY29uc3QgdGFyZ2V0X2FjY291bnRfaWQgPSBuZXcgY2RrLkNmblBhcmFtZXRlcih0aGlzLCAnVGFyZ2V0QWNjb3VudElkJyx7XG4gICAgICBkZXNjcmlwdGlvbiA6ICdUYXJnZXQgQWNjb3VudCBJZCcsXG4gICAgfSk7XG5cbiAgICBjb25zdCByZWdpb25faWQgPSBuZXcgY2RrLkNmblBhcmFtZXRlcih0aGlzLCAnUmVnaW9uSWRzJyx7XG4gICAgICB0eXBlOiAnTGlzdDxTdHJpbmc+JyxcbiAgICAgIGRlc2NyaXB0aW9uIDogJ1JlZ2lvbiBJZHMgdG8gZGVwbG95IFN0YWNrU2V0JyxcbiAgICB9KTtcblxuICAgIG5ldyBzdGFja3NldC5DZm5TdGFja1NldCh0aGlzLCAnRGV2b3BzR3VydVN0YWNrU2V0Jywge1xuICAgICAgcGVybWlzc2lvbk1vZGVsIDogJ1NFTEZfTUFOQUdFRCcsXG4gICAgICBzdGFja1NldE5hbWUgOiAnRW5hYmxlRGV2T3BzR3VydVN0YWNrU2V0TXVsdGlBY2NSZWcnLFxuICAgICAgZGVzY3JpcHRpb24gOiAnQ0RLIFN0YWNrIEluc3RhbmNlIHRvIEVuYWJsZSBEZXZPcHNHdXJ1JyxcbiAgICAgIHN0YWNrSW5zdGFuY2VzR3JvdXA6IFtcbiAgICAgIHtcbiAgICAgICAgZGVwbG95bWVudFRhcmdldHM6IHtcbiAgICAgICAgYWNjb3VudHMgOiBbYWRtaW5fYWNjb3VudF9pZC52YWx1ZUFzU3RyaW5nLHRhcmdldF9hY2NvdW50X2lkLnZhbHVlQXNTdHJpbmddLFxuICAgICAgICB9LFxuICAgICAgICByZWdpb25zOiByZWdpb25faWQudmFsdWVBc0xpc3QsXG4gICAgICB9XSxcbiAgICAgIG9wZXJhdGlvblByZWZlcmVuY2VzOiB7XG4gICAgICAgIGZhaWx1cmVUb2xlcmFuY2VDb3VudDogMCxcbiAgICAgICAgbWF4Q29uY3VycmVudENvdW50OiAxXG4gICAgICB9LFxuICAgICAgdGVtcGxhdGVCb2R5OiBgXG4gICAgICAgIFJlc291cmNlczpcbiAgICAgICAgICBEZXZPcHNHdXJ1TW9uaXRvcmluZzpcbiAgICAgICAgICAgIFR5cGU6IEFXUzo6RGV2T3BzR3VydTo6UmVzb3VyY2VDb2xsZWN0aW9uXG4gICAgICAgICAgICBQcm9wZXJ0aWVzOlxuICAgICAgICAgICAgICBSZXNvdXJjZUNvbGxlY3Rpb25GaWx0ZXI6XG4gICAgICAgICAgICAgICAgQ2xvdWRGb3JtYXRpb246XG4gICAgICAgICAgICAgICAgICBTdGFja05hbWVzOiBbJyonXVxuXG4gICAgICAgICAgRGV2T3BzR3VydVRvcGljOiBcbiAgICAgICAgICAgIFR5cGU6IEFXUzo6U05TOjpUb3BpY1xuICAgICAgICAgICAgUHJvcGVydGllczogXG4gICAgICAgICAgICAgIFRvcGljTmFtZTogZGV2b3BzLWd1cnUtbXVsdGktYWNjXG4gICAgICAgICAgICAgIFN1YnNjcmlwdGlvbjpcbiAgICAgICAgICAgICAgICAtIEVuZHBvaW50OiBhYmNAeHl6LmNvbVxuICAgICAgICAgICAgICAgICAgUHJvdG9jb2w6IGVtYWlsXG4gICAgICAgICAgXG4gICAgICAgICAgRGV2T3BzR3VydU5vdGlmaWNhdGlvbjpcbiAgICAgICAgICAgIFR5cGU6IEFXUzo6RGV2T3BzR3VydTo6Tm90aWZpY2F0aW9uQ2hhbm5lbFxuICAgICAgICAgICAgUHJvcGVydGllczpcbiAgICAgICAgICAgICAgQ29uZmlnOlxuICAgICAgICAgICAgICAgIFNuczpcbiAgICAgICAgICAgICAgICAgIFRvcGljQXJuOiAhUmVmIERldk9wc0d1cnVUb3BpY2BcbiAgfSk7XG4gIH1cbn0iXX0=