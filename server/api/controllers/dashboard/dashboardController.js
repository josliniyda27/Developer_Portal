"use strict";
const db = require("../../model");
const {
  sequelize: Sequelize,
  users: User,
} = db;
const { Op } = require("sequelize");
const { constants } = require("../../../helper");

exports.getDashboardAnalytics = async (req, res) => {

    const data = {
        totalProjects : 510,
        projectProgress : 20,
        totalUnits : 510,
        unitProgress : 20,
        totalCIties : 17,
        bannerImage : 'https://dummyimage.com/881x209/000/fff',
    }

    res.status(constants.statusCode.successCode).send({
        message: constants.messages.dashboardAnalyticsSuccess,
        data: data,
        status: constants.statusCode.successCode,
      });

}  

exports.getDashboardProjectAnalytics = async (req, res) => {

    const data = {
        projects : [
            {
                name : 'Ebenizer Orchid',
                completionPercentage : 35,
            },
            {
                name : 'Den Abode',
                completionPercentage : 20,
            },
            {
                name : 'Panchvati Apartments',
                completionPercentage : 60,
            },
            {
                name : 'Park Elanza',
                completionPercentage : 80,
            },
            {
                name : 'Park Elanza',
                completionPercentage : 90,
            },
            {
                name : 'Ethios Plaza',
                completionPercentage : 10,
            }
        ]
    }

    res.status(constants.statusCode.successCode).send({
        message: constants.messages.projectAnalyticsSuccess,
        data: data,
        status: constants.statusCode.successCode,
      });

}  

exports.getDashboardNotifications = async (req, res) => {

    const data = {
        notifications : [
            {
                name : 'Enter carpet area details for Park Avenue Apartment.',
                id : 1,
            },
            {
                name : 'Updated area details for Park Avenue Apartment.',
                id : 2,
            },
            {
                name : 'The documents submitted has not been approved.',
                id : 3,
            },
            {
                name : 'Enter carpet area details for Park Avenue Apartment.',
                id : 4,
            },
            {
                name : 'Update your work progress. ',
                id : 5,
            },
            {
                name : 'Update your work progress. ',
                id : 5,
            }
        ]
    }

    res.status(constants.statusCode.successCode).send({
        message: constants.messages.dashboardNotificationsSuccess,
        data: data,
        status: constants.statusCode.successCode,
      });

}

exports.getDashboardQueries = async (req, res) => {

    const data = {
        queries : [
            {
                name : 'Query about details for Park Avenue Apartment.',
                id : 1,
            },
            {
                name : 'Query on details for Park Avenue Apartment.',
                id : 2,
            },
            {
                name : 'The documents submitted has not been approved.',
                id : 3,
            },
            {
                name : 'Enter carpet area details for Park Avenue Apartment.',
                id : 4,
            },
            {
                name : 'Update your work progress. ',
                id : 5,
            },
            {
                name : 'Update your work progress. ',
                id : 5,
            }
        ]
    }


    res.status(constants.statusCode.successCode).send({
        message: constants.messages.dashboardQueriesSuccess,
        data: data,
        status: constants.statusCode.successCode,
      });

}

exports.getDashboardLoanAnalytics = async (req, res) => {

    const data = {
        totalNumber : 150,
        totalAmount : 1249,
        underProcessProjectCount : 20,
        underProcessProjectAmount : 120,
        approvedProjectCount : 27,
        underProcessProjectAmount : 230,
        disbursedProjectCount : 55,
        disbursedProjectAmount : 340,

    }

    res.status(constants.statusCode.successCode).send({
        message: constants.messages.dashboardQueriesSuccess,
        data: data,
        status: constants.statusCode.successCode,
      });

}