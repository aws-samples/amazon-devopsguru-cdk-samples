"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdkDevopsguruStack = void 0;
const cdk = require("@aws-cdk/core");
const devopsguru = require("@aws-cdk/aws-devopsguru");
const sns = require("@aws-cdk/aws-sns");
const kms = require("@aws-cdk/aws-kms");
const subscriptions = require("@aws-cdk/aws-sns-subscriptions");
const stackset = require("@aws-cdk/aws-cloudformation");
class CdkDevopsguruStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // Coverage 
        new devopsguru.CfnResourceCollection(this, 'resources', {
            resourceCollectionFilter: {
                cloudFormation: {
                    stackNames: ['CdkInfrastructureStack']
                }
            }
        });
        // SNS Topic
        const alias = new kms.Key(this, 'DevOpsGuruCMK').addAlias('devopsguru');
        const topic = new sns.Topic(this, 'Topic', {
            displayName: 'DevOps Guru subscription topic',
            topicName: 'DevopsGuru',
            masterKey: alias,
        });
        // SNS Subscription  
        const emailAddress = new cdk.CfnParameter(this, 'emailAddress', {
            type: 'String',
            description: 'Email id to receive SNS Notifications',
        });
        topic.addSubscription(new subscriptions.EmailSubscription(emailAddress.valueAsString));
        // Notification
        new devopsguru.CfnNotificationChannel(this, 'notification', {
            config: {
                sns: {
                    topicArn: topic.topicArn
                }
            }
        });
        // StackSet
        new stackset.CfnStackSet(this, 'DevopsGuruStackSet', {
            permissionModel: 'SERVICE_MANAGED',
            stackSetName: 'DevopsGuruStackSet'
        });
    }
}
exports.CdkDevopsguruStack = CdkDevopsguruStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLWRldm9wc2d1cnUtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjZGstZGV2b3BzZ3VydS1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxQ0FBcUM7QUFDckMsc0RBQXVEO0FBRXZELHdDQUF3QztBQUN4Qyx3Q0FBd0M7QUFDeEMsZ0VBQWdFO0FBRWhFLHdEQUF5RDtBQUV6RCxNQUFhLGtCQUFtQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQy9DLFlBQVksS0FBb0IsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDbEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFMUIsWUFBWTtRQUNWLElBQUksVUFBVSxDQUFDLHFCQUFxQixDQUFDLElBQUksRUFBRSxXQUFXLEVBQUU7WUFDdkQsd0JBQXdCLEVBQUc7Z0JBQ3pCLGNBQWMsRUFBRztvQkFDZixVQUFVLEVBQUcsQ0FBQyx3QkFBd0IsQ0FBQztpQkFDeEM7YUFDRjtTQUNELENBQUMsQ0FBQztRQUVMLFlBQVk7UUFDVixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLGVBQWUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQTtRQUN2RSxNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRTtZQUN6QyxXQUFXLEVBQUUsZ0NBQWdDO1lBQzdDLFNBQVMsRUFBRSxZQUFZO1lBQ3ZCLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQUMsQ0FBQztRQUVMLHFCQUFxQjtRQUNuQixNQUFNLFlBQVksR0FBRyxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBQztZQUM3RCxJQUFJLEVBQUUsUUFBUTtZQUNkLFdBQVcsRUFBRyx1Q0FBdUM7U0FFdEQsQ0FBQyxDQUFDO1FBQ0gsS0FBSyxDQUFDLGVBQWUsQ0FBQyxJQUFJLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztRQUV6RixlQUFlO1FBQ2IsSUFBSSxVQUFVLENBQUMsc0JBQXNCLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRTtZQUMxRCxNQUFNLEVBQUc7Z0JBQ1AsR0FBRyxFQUFFO29CQUNILFFBQVEsRUFBRSxLQUFLLENBQUMsUUFBUTtpQkFDekI7YUFDRjtTQUNGLENBQ0EsQ0FBQTtRQUVILFdBQVc7UUFDVCxJQUFJLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLG9CQUFvQixFQUFFO1lBQ25ELGVBQWUsRUFBRyxpQkFBaUI7WUFDbkMsWUFBWSxFQUFHLG9CQUFvQjtTQUN0QyxDQUFDLENBQUE7SUFDRixDQUFDO0NBQ0Y7QUE3Q0QsZ0RBNkNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IGRldm9wc2d1cnUgPSByZXF1aXJlKCdAYXdzLWNkay9hd3MtZGV2b3BzZ3VydScpO1xuaW1wb3J0IHsgY29uZmlnIH0gZnJvbSAncHJvY2Vzcyc7XG5pbXBvcnQgKiBhcyBzbnMgZnJvbSAnQGF3cy1jZGsvYXdzLXNucyc7XG5pbXBvcnQgKiBhcyBrbXMgZnJvbSBcIkBhd3MtY2RrL2F3cy1rbXNcIjtcbmltcG9ydCAqIGFzIHN1YnNjcmlwdGlvbnMgZnJvbSAnQGF3cy1jZGsvYXdzLXNucy1zdWJzY3JpcHRpb25zJztcbmltcG9ydCAqIGFzIENmblBhcmFtZXRlciBmcm9tICdAYXdzLWNkay9hd3Mtc3NtJztcbmltcG9ydCBzdGFja3NldCA9IHJlcXVpcmUoJ0Bhd3MtY2RrL2F3cy1jbG91ZGZvcm1hdGlvbicpO1xuXG5leHBvcnQgY2xhc3MgQ2RrRGV2b3BzZ3VydVN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTsgICAgXG5cbiAgLy8gQ292ZXJhZ2UgXG4gICAgbmV3IGRldm9wc2d1cnUuQ2ZuUmVzb3VyY2VDb2xsZWN0aW9uKHRoaXMsICdyZXNvdXJjZXMnLCB7XG4gICAgIHJlc291cmNlQ29sbGVjdGlvbkZpbHRlciA6IHtcbiAgICAgICBjbG91ZEZvcm1hdGlvbiA6IHtcbiAgICAgICAgIHN0YWNrTmFtZXM6ICBbJ0Nka0luZnJhc3RydWN0dXJlU3RhY2snXVxuICAgICAgIH1cbiAgICAgfVxuICAgIH0pO1xuICBcbiAgLy8gU05TIFRvcGljXG4gICAgY29uc3QgYWxpYXMgPSBuZXcga21zLktleSh0aGlzLCAnRGV2T3BzR3VydUNNSycpLmFkZEFsaWFzKCdkZXZvcHNndXJ1JylcbiAgICBjb25zdCB0b3BpYyA9IG5ldyBzbnMuVG9waWModGhpcywgJ1RvcGljJywge1xuICAgICAgZGlzcGxheU5hbWU6ICdEZXZPcHMgR3VydSBzdWJzY3JpcHRpb24gdG9waWMnLFxuICAgICAgdG9waWNOYW1lOiAnRGV2b3BzR3VydScsXG4gICAgICBtYXN0ZXJLZXk6IGFsaWFzLFxuICAgIH0pO1xuICBcbiAgLy8gU05TIFN1YnNjcmlwdGlvbiAgXG4gICAgY29uc3QgZW1haWxBZGRyZXNzID0gbmV3IGNkay5DZm5QYXJhbWV0ZXIodGhpcywgJ2VtYWlsQWRkcmVzcycse1xuICAgICAgdHlwZTogJ1N0cmluZycsXG4gICAgICBkZXNjcmlwdGlvbiA6ICdFbWFpbCBpZCB0byByZWNlaXZlIFNOUyBOb3RpZmljYXRpb25zJyxcbiAgICAgIC8vZGVmYXVsdDogXCJhYmNAeHl6LmNvbVwiLFxuICAgIH0pO1xuICAgIHRvcGljLmFkZFN1YnNjcmlwdGlvbihuZXcgc3Vic2NyaXB0aW9ucy5FbWFpbFN1YnNjcmlwdGlvbihlbWFpbEFkZHJlc3MudmFsdWVBc1N0cmluZykpO1xuXG4gIC8vIE5vdGlmaWNhdGlvblxuICAgIG5ldyBkZXZvcHNndXJ1LkNmbk5vdGlmaWNhdGlvbkNoYW5uZWwodGhpcywgJ25vdGlmaWNhdGlvbicsIHtcbiAgICAgIGNvbmZpZyA6IHtcbiAgICAgICAgc25zOiB7XG4gICAgICAgICAgdG9waWNBcm46IHRvcGljLnRvcGljQXJuXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgKVxuXG4gIC8vIFN0YWNrU2V0XG4gICAgbmV3IHN0YWNrc2V0LkNmblN0YWNrU2V0KHRoaXMsICdEZXZvcHNHdXJ1U3RhY2tTZXQnLCB7XG4gICAgICBwZXJtaXNzaW9uTW9kZWwgOiAnU0VSVklDRV9NQU5BR0VEJyxcbiAgICAgIHN0YWNrU2V0TmFtZSA6ICdEZXZvcHNHdXJ1U3RhY2tTZXQnXG4gIH0pXG4gIH1cbn1cblxuIl19