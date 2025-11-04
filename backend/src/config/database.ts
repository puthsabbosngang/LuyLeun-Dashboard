import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Application } from "../entities/Application";
import { ApplicationAmendingInfo } from "../entities/ApplicationAmendingInfo";
import { ApplicationCallHistory } from "../entities/ApplicationCallHistory";
import { ApplicationContactList } from "../entities/ApplicationContactList";
import { ApplicationEmployee } from "../entities/ApplicationEmployee";
import { ApplicationEmployer } from "../entities/ApplicationEmployer";
import { ApplicationGovernmentOfficer } from "../entities/ApplicationGovernmentOfficer";
import { ApplicationLoanDetail } from "../entities/ApplicationLoanDetail";
import { ApplicationRelative } from "../entities/ApplicationRelative";
import { ApplicationTracking } from "../entities/ApplicationTracking";
import { Comment } from "../entities/Comment";
import { Communication } from "../entities/Communication";
import { ConfCompanyBank } from "../entities/ConfCompanyBank";
import { ConfLoanPurpose } from "../entities/ConfLoanPurpose";  
import { ConfLoanPurposeDetail } from "../entities/ConfLoanPurposeDetail";
import { Customer } from "../entities/Customer";
import { Gallery } from "../entities/Gallary";
import { GeoCommune } from "../entities/GeoCommune";
import { GeoCommuneApplicationEmployees } from "../entities/GeoCommuneApplicationEmployees";
import { GeoCommuneApplicationEmployers } from "../entities/GeoCommuneApplicationEmployers";
import { GeoCommuneApplicationGovernmentOfficers } from "../entities/GeoCommuneApplicationGovernmentOfficer";
import { GeoCommuneApplicationRelatives } from "../entities/GeoCommuneApplicationRelatives";
import { GeoCommuneApplications } from "../entities/GeoCommuneApplications";
import { GeoDistrict } from "../entities/GeoDistrict";
import { GeoProvince } from "../entities/GeoProvince";
import { GeoVillage } from "../entities/GeoVillage";
import { Gift } from "../entities/Gift";
import { Incident } from "../entities/Incident";
import { IncidentSeq } from "../entities/IncidentSeq";
import { Lead } from "../entities/Lead";
import { LeadTracking } from "../entities/LeadTracking";
import { Notification } from "../entities/Notification";
import { PhoneOTP } from "../entities/PhoneOTP";
import { Repayment } from "../entities/Repayment";
import { Staff } from "../entities/Staff";
import { TargetKPI } from "../entities/TargetKPI";
import { TempApp1 } from "../entities/TempApp1";
import { TempApp2 } from "../entities/TempApp2";
import { TempRst } from "../entities/TempRst";
import { TmpUser } from "../entities/TmpUser";
import { User } from "../entities/User";
import { UserCallHistory } from "../entities/UserCallHistory";
import { UserContactList } from "../entities/UserContactList"; 

dotenv.config();

export const db = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "sb@DLT023jds",
  database: process.env.DB_NAME || "los_system",
  synchronize: false,
  logging: true,
  entities: [
    Application, 
    ApplicationAmendingInfo, 
    ApplicationCallHistory, 
    ApplicationContactList, 
    ApplicationEmployee, 
    ApplicationEmployer, 
    ApplicationGovernmentOfficer, 
    ApplicationLoanDetail, 
    ApplicationRelative, 
    ApplicationTracking, 
    Comment, 
    Communication, 
    ConfCompanyBank, 
    ConfLoanPurpose, 
    ConfLoanPurposeDetail, 
    Customer, 
    Gallery, 
    GeoCommune, 
    GeoCommuneApplicationEmployees, 
    GeoCommuneApplicationEmployers, 
    GeoCommuneApplicationGovernmentOfficers, 
    GeoCommuneApplicationRelatives, 
    GeoCommuneApplications, 
    GeoDistrict, 
    GeoProvince, 
    GeoVillage, 
    Gift, 
    Incident, 
    IncidentSeq,
    Lead, 
    LeadTracking, 
    Notification, 
    PhoneOTP, 
    Repayment, 
    Staff, 
    TargetKPI, 
    TempApp1, 
    TempApp2, 
    TempRst, 
    TmpUser, 
    User, 
    UserCallHistory, 
    UserContactList
  ], // Only load entities we need
});