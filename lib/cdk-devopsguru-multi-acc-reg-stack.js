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
            description: 'CDK Stack Instance to Enable DevOpsGuru Across multiple accounts and regions',
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
exports.CdkDevopsGuruStackMultiAccReg = CdkDevopsGuruStackMultiAccReg;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLWRldm9wc2d1cnUtbXVsdGktYWNjLXJlZy1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNkay1kZXZvcHNndXJ1LW11bHRpLWFjYy1yZWctc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUNBQXFDO0FBT3JDLHdEQUF5RDtBQUl6RCxNQUFhLDZCQUE4QixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQzFELFlBQVksS0FBb0IsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDbEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLHdCQUF3QixFQUFDO1lBQzNFLFdBQVcsRUFBRywwQkFBMEI7U0FDekMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFDO1lBQ3JFLFdBQVcsRUFBRyxtQkFBbUI7U0FDbEMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxTQUFTLEdBQUcsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUM7WUFDdkQsSUFBSSxFQUFFLGNBQWM7WUFDcEIsV0FBVyxFQUFHLCtCQUErQjtTQUM5QyxDQUFDLENBQUM7UUFFSCxJQUFJLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLG9CQUFvQixFQUFFO1lBQ25ELGVBQWUsRUFBRyxjQUFjO1lBQ2hDLFlBQVksRUFBRyxxQ0FBcUM7WUFDcEQsV0FBVyxFQUFHLDhFQUE4RTtZQUM1RixtQkFBbUIsRUFBRTtnQkFDckI7b0JBQ0UsaUJBQWlCLEVBQUU7d0JBQ25CLFFBQVEsRUFBRyxDQUFDLGdCQUFnQixDQUFDLGFBQWEsRUFBQyxpQkFBaUIsQ0FBQyxhQUFhLENBQUM7cUJBQzFFO29CQUNELE9BQU8sRUFBRSxTQUFTLENBQUMsV0FBVztpQkFDL0I7YUFBQztZQUNGLG9CQUFvQixFQUFFO2dCQUNwQixxQkFBcUIsRUFBRSxDQUFDO2dCQUN4QixrQkFBa0IsRUFBRSxDQUFDO2FBQ3RCO1lBQ0QsWUFBWSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2lEQXNCNkI7U0FDOUMsQ0FBQyxDQUFDO0lBQ0gsQ0FBQztDQUNGO0FBekRELHNFQXlEQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCBkZXZvcHNndXJ1ID0gcmVxdWlyZSgnQGF3cy1jZGsvYXdzLWRldm9wc2d1cnUnKTtcbmltcG9ydCB7IGNvbmZpZyB9IGZyb20gJ3Byb2Nlc3MnO1xuaW1wb3J0ICogYXMgc25zIGZyb20gJ0Bhd3MtY2RrL2F3cy1zbnMnO1xuaW1wb3J0ICogYXMga21zIGZyb20gXCJAYXdzLWNkay9hd3Mta21zXCI7XG5pbXBvcnQgKiBhcyBzdWJzY3JpcHRpb25zIGZyb20gJ0Bhd3MtY2RrL2F3cy1zbnMtc3Vic2NyaXB0aW9ucyc7XG5pbXBvcnQgKiBhcyBDZm5QYXJhbWV0ZXIgZnJvbSAnQGF3cy1jZGsvYXdzLXNzbSc7XG5pbXBvcnQgc3RhY2tzZXQgPSByZXF1aXJlKCdAYXdzLWNkay9hd3MtY2xvdWRmb3JtYXRpb24nKTtcbmltcG9ydCB7IGNyZWF0ZSB9IGZyb20gJ2RvbWFpbic7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5cbmV4cG9ydCBjbGFzcyBDZGtEZXZvcHNHdXJ1U3RhY2tNdWx0aUFjY1JlZyBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7ICAgIFxuXG4gICAgY29uc3QgYWRtaW5fYWNjb3VudF9pZCA9IG5ldyBjZGsuQ2ZuUGFyYW1ldGVyKHRoaXMsICdBZG1pbmlzdHJhdG9yQWNjb3VudElkJyx7XG4gICAgICBkZXNjcmlwdGlvbiA6ICdBZG1pbmlzdHJhdG9yIEFjY291bnQgSWQnLFxuICAgIH0pO1xuXG4gICAgY29uc3QgdGFyZ2V0X2FjY291bnRfaWQgPSBuZXcgY2RrLkNmblBhcmFtZXRlcih0aGlzLCAnVGFyZ2V0QWNjb3VudElkJyx7XG4gICAgICBkZXNjcmlwdGlvbiA6ICdUYXJnZXQgQWNjb3VudCBJZCcsXG4gICAgfSk7XG5cbiAgICBjb25zdCByZWdpb25faWQgPSBuZXcgY2RrLkNmblBhcmFtZXRlcih0aGlzLCAnUmVnaW9uSWRzJyx7XG4gICAgICB0eXBlOiAnTGlzdDxTdHJpbmc+JyxcbiAgICAgIGRlc2NyaXB0aW9uIDogJ1JlZ2lvbiBJZHMgdG8gZGVwbG95IFN0YWNrU2V0JyxcbiAgICB9KTtcblxuICAgIG5ldyBzdGFja3NldC5DZm5TdGFja1NldCh0aGlzLCAnRGV2b3BzR3VydVN0YWNrU2V0Jywge1xuICAgICAgcGVybWlzc2lvbk1vZGVsIDogJ1NFTEZfTUFOQUdFRCcsXG4gICAgICBzdGFja1NldE5hbWUgOiAnRW5hYmxlRGV2T3BzR3VydVN0YWNrU2V0TXVsdGlBY2NSZWcnLFxuICAgICAgZGVzY3JpcHRpb24gOiAnQ0RLIFN0YWNrIEluc3RhbmNlIHRvIEVuYWJsZSBEZXZPcHNHdXJ1IEFjcm9zcyBtdWx0aXBsZSBhY2NvdW50cyBhbmQgcmVnaW9ucycsXG4gICAgICBzdGFja0luc3RhbmNlc0dyb3VwOiBbXG4gICAgICB7XG4gICAgICAgIGRlcGxveW1lbnRUYXJnZXRzOiB7XG4gICAgICAgIGFjY291bnRzIDogW2FkbWluX2FjY291bnRfaWQudmFsdWVBc1N0cmluZyx0YXJnZXRfYWNjb3VudF9pZC52YWx1ZUFzU3RyaW5nXSxcbiAgICAgICAgfSxcbiAgICAgICAgcmVnaW9uczogcmVnaW9uX2lkLnZhbHVlQXNMaXN0LFxuICAgICAgfV0sXG4gICAgICBvcGVyYXRpb25QcmVmZXJlbmNlczoge1xuICAgICAgICBmYWlsdXJlVG9sZXJhbmNlQ291bnQ6IDAsXG4gICAgICAgIG1heENvbmN1cnJlbnRDb3VudDogMVxuICAgICAgfSxcbiAgICAgIHRlbXBsYXRlQm9keTogYFxuICAgICAgICBSZXNvdXJjZXM6XG4gICAgICAgICAgRGV2T3BzR3VydU1vbml0b3Jpbmc6XG4gICAgICAgICAgICBUeXBlOiBBV1M6OkRldk9wc0d1cnU6OlJlc291cmNlQ29sbGVjdGlvblxuICAgICAgICAgICAgUHJvcGVydGllczpcbiAgICAgICAgICAgICAgUmVzb3VyY2VDb2xsZWN0aW9uRmlsdGVyOlxuICAgICAgICAgICAgICAgIENsb3VkRm9ybWF0aW9uOlxuICAgICAgICAgICAgICAgICAgU3RhY2tOYW1lczogWycqJ11cblxuICAgICAgICAgIERldk9wc0d1cnVUb3BpYzogXG4gICAgICAgICAgICBUeXBlOiBBV1M6OlNOUzo6VG9waWNcbiAgICAgICAgICAgIFByb3BlcnRpZXM6IFxuICAgICAgICAgICAgICBUb3BpY05hbWU6IGRldm9wcy1ndXJ1LW11bHRpLWFjY1xuICAgICAgICAgICAgICBTdWJzY3JpcHRpb246XG4gICAgICAgICAgICAgICAgLSBFbmRwb2ludDogZ2lrd2FkckBhbWF6b24uY29tXG4gICAgICAgICAgICAgICAgICBQcm90b2NvbDogZW1haWxcbiAgICAgICAgICBcbiAgICAgICAgICBEZXZPcHNHdXJ1Tm90aWZpY2F0aW9uOlxuICAgICAgICAgICAgVHlwZTogQVdTOjpEZXZPcHNHdXJ1OjpOb3RpZmljYXRpb25DaGFubmVsXG4gICAgICAgICAgICBQcm9wZXJ0aWVzOlxuICAgICAgICAgICAgICBDb25maWc6XG4gICAgICAgICAgICAgICAgU25zOlxuICAgICAgICAgICAgICAgICAgVG9waWNBcm46ICFSZWYgRGV2T3BzR3VydVRvcGljYFxuICB9KTtcbiAgfVxufSJdfQ==