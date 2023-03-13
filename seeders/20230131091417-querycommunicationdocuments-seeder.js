module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('query_communication_documents', [{
      query_communication_id: 7,
      document_name: 'my file.xls',
      document_url: 'https://centelon-my.sharepoint.com/:x:/p/khaleel_ik/EXU_dx5pHZBGgPn9LkfbDh4BoIzPEHmbZl4ynb34hbloBA?wdOrigin=TEAMS-WEB.p2p.bim&wdExp=TEAMS-CONTROL&wdhostclicktime=1676981474678&web=1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      query_communication_id: 7,
      document_name: 'my file.xls',
      document_url: 'https://centelon-my.sharepoint.com/:x:/p/khaleel_ik/EXU_dx5pHZBGgPn9LkfbDh4BoIzPEHmbZl4ynb34hbloBA?wdOrigin=TEAMS-WEB.p2p.bim&wdExp=TEAMS-CONTROL&wdhostclicktime=1676981474678&web=1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      query_communication_id: 7,
      document_name: 'my file.xls',
      document_url: 'https://centelon-my.sharepoint.com/:x:/p/khaleel_ik/EXU_dx5pHZBGgPn9LkfbDh4BoIzPEHmbZl4ynb34hbloBA?wdOrigin=TEAMS-WEB.p2p.bim&wdExp=TEAMS-CONTROL&wdhostclicktime=1676981474678&web=1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
]);

  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('queries', null, {});
  }
};