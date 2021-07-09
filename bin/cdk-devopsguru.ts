#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkStackSetAdminRole } from '../lib/cdk-stackset-admin-role-stack';
import { CdkStackSetExecutionRole } from '../lib/cdk-stackset-exec-role-stack';
import { CdkDevopsGuruStackMultiAccReg } from '../lib/cdk-devopsguru-multi-acc-reg-stack';
import { CdkDevopsGuruStackMultiAccRegSpecStacks } from '../lib/cdk-devopsguru-multi-acc-reg-spec-stack';
import { CdkDevopsguruStackOrgUnit } from '../lib/cdk-devopsguru-org-uni-stack';
import { CdkInfrastructureStack } from '../lib/infrastructure-stack';

const app = new cdk.App();

new CdkStackSetAdminRole(app,'CdkStackSetAdminRole', { 
  description : 'CDK Stack for creating AWSCloudFormationStackSetAdministrationRole .'
});

new CdkStackSetExecutionRole(app,'CdkStackSetExecRole', {
  description : 'CDK Stack for creating AWSCloudFormationStackSetExecutionRole.'
 });

new CdkDevopsGuruStackMultiAccReg(app, 'CdkDevopsGuruStackMultiAccReg', {
  description : 'CDK Stack for enabling DevOps Guru Service for all stack resources across multiple accounts and regions.'
 });

new CdkDevopsGuruStackMultiAccRegSpecStacks(app,'CdkDevopsGuruStackMultiAccRegSpecStacks', {
  description : 'CDK Stack for enabling DevOps Guru Service for specific stack resources across multiple accounts and regions.'
 });

new CdkDevopsguruStackOrgUnit(app,'CdkDevopsguruStackOrgUnit', {
  description : 'CDK Stack for enabling DevOps Guru Service for all stack resources across Orgnizational Units (OU).'
 });

new CdkInfrastructureStack(app,'CdkInfrastructureStack', { 
  description : 'CDK Stack for deploying sample serverless application.'
});