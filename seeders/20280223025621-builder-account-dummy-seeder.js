module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('builder_accounts', [{
      payee_name: 'Asset homes',
      account_type: 'Current',
      account_number: '87654321234566',
      bank: 'SBI homes',
      ifsc_code: 'SBIN0009876',
      file_url: 'https://hdfclimited--pamscentel.sandbox.lightning.force.com',
      file_name: 'book.png',
      status: 'Approved',
      company_id: 1,
      project_id: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      payee_name: 'Ganges homes',
      account_type: 'Savings',
      account_number: '87654321233366',
      bank: 'HDFC homes',
      ifsc_code: 'HDFCN0009876',
      file_url: 'https://hdfclimited--pamscentel.sandbox.lightning.force.com',
      file_name: 'book.png',
      status: 'Approved',
      company_id: 1,
      project_id: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('builder_accounts', null, {});
  }
};