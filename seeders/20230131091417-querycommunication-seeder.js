module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('queries', [{
      name: 'Need status updation on the project information',
      description: 'General Query',
      type: 'general',
      project_id:82,
      company_id:236,
      user_id:1,
      priority_flag:true,
      raised_by:'Vivyan Richard',
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Need NOC information added for the project',
      description: 'General Query',
      type: 'general',
      project_id:82,
      company_id:236,
      user_id:1,
      priority_flag:false,
      raised_by:'Vivyan Richard',
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Need supporting document for RERA',
      description: 'General Query',
      type: 'document',
      project_id:82,
      company_id:236,
      user_id:1,
      priority_flag:false,
      raised_by:'Vivyan Richard',
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Need supporting document for purchaser PAN',
      description: 'General Query',
      type: 'document',
      project_id:82,
      company_id:236,
      user_id:1,
      priority_flag:true,
      raised_by:'Jay Richard',
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Document needed for sales deed',
      description: 'General Query',
      type: 'document',
      project_id:82,
      company_id:236,
      user_id:1,
      priority_flag:false,
      raised_by:'Mama Richard',
      status: 'SUBMITTED',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    await queryInterface.bulkInsert('query_communications', [{
      query_id: 1,
      message: 'Need status updation on the project information',
      source: 'hdfc',
      destination: 'portal',
      document_name: '',
      document_url: '',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      query_id: 1,
      message: 'data has been added as requested',
      source: 'portal',
      destination: 'hdfc',
      document_name: '',
      document_url: '',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      query_id: 2,
      message: 'This is not enough for the descriptions. pls update it',
      source: 'hdfc',
      destination: 'portal',
      document_name: '',
      document_url: '',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      query_id: 2,
      message: 'Need status updation on the project information',
      source: 'hdfc',
      destination: 'portal',
      document_name: '',
      document_url: '',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      query_id: 3,
      message: 'Need supporting document for RERA. pls add it before 25th',
      source: 'hdfc',
      destination: 'portal',
      document_name: '',
      document_url: '',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      query_id: 3,
      message: 'Pls check this',
      source: 'portal',
      destination: 'hdfc',
      document_name: 'my file.xls',
      document_url: 'https://centelon-my.sharepoint.com/:x:/p/khaleel_ik/EXU_dx5pHZBGgPn9LkfbDh4BoIzPEHmbZl4ynb34hbloBA?wdOrigin=TEAMS-WEB.p2p.bim&wdExp=TEAMS-CONTROL&wdhostclicktime=1676981474678&web=1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      query_id: 4,
      message: 'Need supporting document. pls add it before 25th',
      source: 'hdfc',
      destination: 'portal',
      document_name: '',
      document_url: '',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      query_id: 5,
      message: 'Need supporting document for RERA. pls add it before 25th',
      source: 'hdfc',
      destination: 'portal',
      document_name: '',
      document_url: '',
      createdAt: new Date(),
      updatedAt: new Date()
    }
]);

  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('queries', null, {});
  }
};