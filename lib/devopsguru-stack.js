"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdkDevopsguruStack = void 0;
const cdk = require("@aws-cdk/core");
const devopsguru = require("@aws-cdk/aws-devopsguru");
class CdkDevopsguruStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // The code that defines your stack goes here
        new devopsguru.CfnResourceCollection(this, 'resources', {
            resourceCollectionFilter: {
                cloudFormation: {
                    stackNames: ['*']
                }
            }
        });
    }
}
exports.CdkDevopsguruStack = CdkDevopsguruStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2b3BzZ3VydS1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRldm9wc2d1cnUtc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUNBQXFDO0FBQ3JDLHNEQUF1RDtBQUV2RCxNQUFhLGtCQUFtQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQy9DLFlBQVksS0FBb0IsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDbEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDeEIsNkNBQTZDO1FBRTdDLElBQUksVUFBVSxDQUFDLHFCQUFxQixDQUFDLElBQUksRUFBRSxXQUFXLEVBQUU7WUFDdkQsd0JBQXdCLEVBQUc7Z0JBQ3pCLGNBQWMsRUFBRztvQkFDZixVQUFVLEVBQUcsQ0FBQyxHQUFHLENBQUU7aUJBQ3BCO2FBQ0Y7U0FDRCxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFiRCxnREFhQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCBkZXZvcHNndXJ1ID0gcmVxdWlyZSgnQGF3cy1jZGsvYXdzLWRldm9wc2d1cnUnKTtcblxuZXhwb3J0IGNsYXNzIENka0Rldm9wc2d1cnVTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG4gICAgLy8gVGhlIGNvZGUgdGhhdCBkZWZpbmVzIHlvdXIgc3RhY2sgZ29lcyBoZXJlXG4gICAgXG4gICAgbmV3IGRldm9wc2d1cnUuQ2ZuUmVzb3VyY2VDb2xsZWN0aW9uKHRoaXMsICdyZXNvdXJjZXMnLCB7XG4gICAgIHJlc291cmNlQ29sbGVjdGlvbkZpbHRlciA6IHtcbiAgICAgICBjbG91ZEZvcm1hdGlvbiA6IHtcbiAgICAgICAgIHN0YWNrTmFtZXM6ICBbJyonIF1cbiAgICAgICB9XG4gICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG4iXX0=