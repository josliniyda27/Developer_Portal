"use strict";
const db = require("../server/api/model");
const {
  roles: Role,
  permissions: Permission,
  users: User,
} = db;
const { Pool } = require('pg');

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const superAdmin = await Role.create({ 
      name: 'Super Admin', 
      description: "Super admin has all permissions over all companies and projects" 
    });

    console.log(superAdmin.dataValues.id);

    await User.update(
      {
        role_id : superAdmin.dataValues.id
      },
      { where: {} })

    const admin = await Role.create({ 
      name: 'Admin', 
      description: "Admin has all permissions over one companies and its projects" 
    });

    const allSection = await Role.create({ 
      name: 'All Sections', 
      description: "All Sections has all permissions over one companies and its projects except user management and CF" 
    });

    const salesAndMarketing = await Role.create({ 
      name: 'Sales/Marketing', 
      description: "Sales and marketing update work progress and project creation" 
    });

    const accounts = await Role.create({ 
      name: 'Accounts', 
      description: "Accounts update work progress and project creation" 
    });

    const cf = await Role.create({ 
      name: 'Construction Finance', 
      description: "Construction Finance update work progress and project creation" 
    });

    //Profile
    const viewOwnProfile = await Permission.create({ name: 'view_own_profile' });
    const editOwnProfile = await Permission.create({ name: 'edit_own_profile' });

    //company
    const createCompany = await Permission.create({ name: 'create_company' });
    const editCompany = await Permission.create({ name: 'edit_company' });
    const listCompany = await Permission.create({ name: 'list_company' });
    const listOwnCompany = await Permission.create({ name: 'list_own_company' });
    const viewCompany = await Permission.create({ name: 'view_company' });
    const deleteCompany = await Permission.create({ name: 'delete_company' });

    //Project
    const createProject = await Permission.create({ name: 'create_project' });
    const editProject = await Permission.create({ name: 'edit_project' });
    const listProject = await Permission.create({ name: 'list_project' });
    const listOwnProject = await Permission.create({ name: 'list_own_project' });
    const viewProject = await Permission.create({ name: 'view_project' });
    const deleteProject = await Permission.create({ name: 'delete_project' }); 
    
    const createProjectAddress = await Permission.create({ name: 'create_project_address' });
    const editProjectAddress = await Permission.create({ name: 'edit_project_address' });
    
    //Query
    const createQuery = await Permission.create({ name: 'create_query' });
    const editQuery = await Permission.create({ name: 'edit_query' });
    const listQuery = await Permission.create({ name: 'list_query' });
    const viewQuery = await Permission.create({ name: 'view_query' });
    const deleteQuery = await Permission.create({ name: 'delete_query' });
    
    //User
    const assignUserToCompany = await Permission.create({ name: 'assign_user_to_company' });
    
    const getCreatedUsers = await Permission.create({ name: 'get_created_users' });
    const makeAdminUser = await Permission.create({ name: 'make_admin_user' });

    const createUser = await Permission.create({ name: 'create_user' });
    const editUser = await Permission.create({ name: 'edit_user' });
    const listUser = await Permission.create({ name: 'list_user' });
    const viewUser = await Permission.create({ name: 'view_user' });
    const deleteUser = await Permission.create({ name: 'delete_user' });

    //Work progress
    const createWorkProgress = await Permission.create({ name: 'create_work_progress' });
    const editWorkProgress = await Permission.create({ name: 'edit_work_progress' });
    const listWorkProgress = await Permission.create({ name: 'list_work_progress' });
    const viewWorkProgress = await Permission.create({ name: 'view_work_progress' });
    const deleteWorkProgress = await Permission.create({ name: 'delete_work_progress' });

    //Bank Account
    const createBankAccount = await Permission.create({ name: 'create_bank_account' });
    const editBankAccount = await Permission.create({ name: 'edit_bank_account' });
    const listBankAccount = await Permission.create({ name: 'list_bank_account' });
    const viewBankAccount = await Permission.create({ name: 'view_bank_account' });
    const deleteBankAccount = await Permission.create({ name: 'delete_bank_account' }); 
    
    //Inventory
    const createInventory = await Permission.create({ name: 'create_inventory' });
    const editInventory = await Permission.create({ name: 'edit_inventory' });
    const listInventory = await Permission.create({ name: 'list_inventory' });
    const viewInventory = await Permission.create({ name: 'view_inventory' });
    const deleteInventory = await Permission.create({ name: 'delete_inventory' });     

    //Builder
    const createBuilder = await Permission.create({ name: 'create_builder' });
    const editBuilder = await Permission.create({ name: 'edit_builder' });
    const listBuilder = await Permission.create({ name: 'list_builder' });
    const viewBuilder = await Permission.create({ name: 'view_builder' });
    const deleteBuilder = await Permission.create({ name: 'delete_builder' }); 

    //Purchaser
    const createPurchaser = await Permission.create({ name: 'create_purchaser' });
    const editPurchaser = await Permission.create({ name: 'edit_purchaser' });
    const listPurchaser = await Permission.create({ name: 'list_purchaser' });
    const viewPurchaser = await Permission.create({ name: 'view_purchaser' });
    const deletePurchaser = await Permission.create({ name: 'delete_purchaser' });     

    //Roles

    const listRole = await Permission.create({ name: 'list_role' });
    const viewRole = await Permission.create({ name: 'view_role' });
;
    
    //Super Admin
    await superAdmin.addPermissions(viewOwnProfile);
    await superAdmin.addPermissions(editOwnProfile);

    await superAdmin.addPermissions(assignUserToCompany);
    await superAdmin.addPermissions(getCreatedUsers);
    await superAdmin.addPermissions(makeAdminUser);

    await superAdmin.addPermissions(createCompany);
    await superAdmin.addPermissions(editCompany);
    await superAdmin.addPermissions(listCompany);
    await superAdmin.addPermissions(listOwnCompany);
    await superAdmin.addPermissions(viewCompany);
    await superAdmin.addPermissions(deleteCompany);

    await superAdmin.addPermissions(createProject);
    await superAdmin.addPermissions(editProject);
    await superAdmin.addPermissions(listProject);
    await superAdmin.addPermissions(listOwnProject);
    await superAdmin.addPermissions(viewProject);
    await superAdmin.addPermissions(deleteProject);

    await superAdmin.addPermissions(createProjectAddress);
    await superAdmin.addPermissions(editProjectAddress);

    await superAdmin.addPermissions(createQuery);
    await superAdmin.addPermissions(editQuery);
    await superAdmin.addPermissions(listQuery);
    await superAdmin.addPermissions(viewQuery);
    await superAdmin.addPermissions(deleteQuery);

    await superAdmin.addPermissions(createUser);
    await superAdmin.addPermissions(editUser);
    await superAdmin.addPermissions(listUser);
    await superAdmin.addPermissions(viewUser);
    await superAdmin.addPermissions(deleteUser); 

    await superAdmin.addPermissions(createWorkProgress);
    await superAdmin.addPermissions(editWorkProgress);
    await superAdmin.addPermissions(listWorkProgress);
    await superAdmin.addPermissions(viewWorkProgress);
    await superAdmin.addPermissions(deleteWorkProgress); 

    await superAdmin.addPermissions(createBankAccount);
    await superAdmin.addPermissions(editBankAccount);
    await superAdmin.addPermissions(listBankAccount);
    await superAdmin.addPermissions(viewBankAccount);
    await superAdmin.addPermissions(deleteBankAccount);
    
    await superAdmin.addPermissions(createInventory);
    await superAdmin.addPermissions(editInventory);
    await superAdmin.addPermissions(listInventory);
    await superAdmin.addPermissions(viewInventory);
    await superAdmin.addPermissions(deleteInventory); 

    await superAdmin.addPermissions(createBuilder);
    await superAdmin.addPermissions(editBuilder);
    await superAdmin.addPermissions(listBuilder);
    await superAdmin.addPermissions(viewBuilder);
    await superAdmin.addPermissions(deleteBuilder);  
    
    await superAdmin.addPermissions(createPurchaser);
    await superAdmin.addPermissions(editPurchaser);
    await superAdmin.addPermissions(listPurchaser);
    await superAdmin.addPermissions(viewPurchaser);
    await superAdmin.addPermissions(deletePurchaser);  
    
    await superAdmin.addPermissions(listRole);
    await superAdmin.addPermissions(viewRole);     


    //Admin
    await admin.addPermissions(viewOwnProfile);
    await admin.addPermissions(editOwnProfile);
    
    await admin.addPermissions(assignUserToCompany);
    await admin.addPermissions(getCreatedUsers);
    await admin.addPermissions(makeAdminUser);
    
    await admin.addPermissions(createCompany);
    await admin.addPermissions(editCompany);
    await admin.addPermissions(listCompany);
    await admin.addPermissions(listOwnCompany);
    await admin.addPermissions(viewCompany);
    await admin.addPermissions(deleteCompany);
    
    await admin.addPermissions(createProject);
    await admin.addPermissions(editProject);
    await admin.addPermissions(listProject);
    await admin.addPermissions(listOwnProject);
    await admin.addPermissions(viewProject);
    await admin.addPermissions(deleteProject);
    
    await admin.addPermissions(createProjectAddress);
    await admin.addPermissions(editProjectAddress);
    
    await admin.addPermissions(createQuery);
    await admin.addPermissions(editQuery);
    await admin.addPermissions(listQuery);
    await admin.addPermissions(viewQuery);
    await admin.addPermissions(deleteQuery);
    
    await admin.addPermissions(createUser);
    await admin.addPermissions(editUser);
    await admin.addPermissions(listUser);
    await admin.addPermissions(viewUser);
    await admin.addPermissions(deleteUser); 
    
    await admin.addPermissions(createWorkProgress);
    await admin.addPermissions(editWorkProgress);
    await admin.addPermissions(listWorkProgress);
    await admin.addPermissions(viewWorkProgress);
    await admin.addPermissions(deleteWorkProgress); 
    
    await admin.addPermissions(createBankAccount);
    await admin.addPermissions(editBankAccount);
    await admin.addPermissions(listBankAccount);
    await admin.addPermissions(viewBankAccount);
    await admin.addPermissions(deleteBankAccount);
    
    await admin.addPermissions(createInventory);
    await admin.addPermissions(editInventory);
    await admin.addPermissions(listInventory);
    await admin.addPermissions(viewInventory);
    await admin.addPermissions(deleteInventory); 
    
    await admin.addPermissions(createBuilder);
    await admin.addPermissions(editBuilder);
    await admin.addPermissions(listBuilder);
    await admin.addPermissions(viewBuilder);
    await admin.addPermissions(deleteBuilder);  
    
    await admin.addPermissions(createPurchaser);
    await admin.addPermissions(editPurchaser);
    await admin.addPermissions(listPurchaser);
    await admin.addPermissions(viewPurchaser);
    await admin.addPermissions(deletePurchaser);  
    
    await admin.addPermissions(listRole);
    await admin.addPermissions(viewRole); 


    //All Section

    await allSection.addPermissions(viewOwnProfile);
    await allSection.addPermissions(editOwnProfile);
    
    await allSection.addPermissions(assignUserToCompany);
    await allSection.addPermissions(getCreatedUsers);
    await allSection.addPermissions(makeAdminUser);
    
    await allSection.addPermissions(createCompany);
    await allSection.addPermissions(editCompany);
    await allSection.addPermissions(listCompany);
    await allSection.addPermissions(listOwnCompany);
    await allSection.addPermissions(viewCompany);
    await allSection.addPermissions(deleteCompany);
    
    await allSection.addPermissions(createProject);
    await allSection.addPermissions(editProject);
    await allSection.addPermissions(listProject);
    await allSection.addPermissions(listOwnProject);
    await allSection.addPermissions(viewProject);
    await allSection.addPermissions(deleteProject);
    
    await allSection.addPermissions(createProjectAddress);
    await allSection.addPermissions(editProjectAddress);
    
    await allSection.addPermissions(createQuery);
    await allSection.addPermissions(editQuery);
    await allSection.addPermissions(listQuery);
    await allSection.addPermissions(viewQuery);
    await allSection.addPermissions(deleteQuery);
    
    await allSection.addPermissions(createUser);
    await allSection.addPermissions(editUser);
    await allSection.addPermissions(listUser);
    await allSection.addPermissions(viewUser);
    await allSection.addPermissions(deleteUser); 
    
    await allSection.addPermissions(createWorkProgress);
    await allSection.addPermissions(editWorkProgress);
    await allSection.addPermissions(listWorkProgress);
    await allSection.addPermissions(viewWorkProgress);
    await allSection.addPermissions(deleteWorkProgress); 
    
    await allSection.addPermissions(createBankAccount);
    await allSection.addPermissions(editBankAccount);
    await allSection.addPermissions(listBankAccount);
    await allSection.addPermissions(viewBankAccount);
    await allSection.addPermissions(deleteBankAccount);
    
    await allSection.addPermissions(createInventory);
    await allSection.addPermissions(editInventory);
    await allSection.addPermissions(listInventory);
    await allSection.addPermissions(viewInventory);
    await allSection.addPermissions(deleteInventory); 
    
    await allSection.addPermissions(createBuilder);
    await allSection.addPermissions(editBuilder);
    await allSection.addPermissions(listBuilder);
    await allSection.addPermissions(viewBuilder);
    await allSection.addPermissions(deleteBuilder);  
    
    await allSection.addPermissions(createPurchaser);
    await allSection.addPermissions(editPurchaser);
    await allSection.addPermissions(listPurchaser);
    await allSection.addPermissions(viewPurchaser);
    await allSection.addPermissions(deletePurchaser);  
    
    await allSection.addPermissions(listRole);
    await allSection.addPermissions(viewRole); 


    //Sales and marketting
    await salesAndMarketing.addPermissions(viewOwnProfile);
    await salesAndMarketing.addPermissions(editOwnProfile);
    
    await salesAndMarketing.addPermissions(assignUserToCompany);
    await salesAndMarketing.addPermissions(getCreatedUsers);
    await salesAndMarketing.addPermissions(makeAdminUser);
    
    await salesAndMarketing.addPermissions(createCompany);
    await salesAndMarketing.addPermissions(editCompany);
    await salesAndMarketing.addPermissions(listCompany);
    await salesAndMarketing.addPermissions(listOwnCompany);
    await salesAndMarketing.addPermissions(viewCompany);
    await salesAndMarketing.addPermissions(deleteCompany);
    
    await salesAndMarketing.addPermissions(createProject);
    await salesAndMarketing.addPermissions(editProject);
    await salesAndMarketing.addPermissions(listProject);
    await salesAndMarketing.addPermissions(listOwnProject);
    await salesAndMarketing.addPermissions(viewProject);
    await salesAndMarketing.addPermissions(deleteProject);
    
    await salesAndMarketing.addPermissions(createProjectAddress);
    await salesAndMarketing.addPermissions(editProjectAddress);
    
    await salesAndMarketing.addPermissions(createQuery);
    await salesAndMarketing.addPermissions(editQuery);
    await salesAndMarketing.addPermissions(listQuery);
    await salesAndMarketing.addPermissions(viewQuery);
    await salesAndMarketing.addPermissions(deleteQuery);
    
    await salesAndMarketing.addPermissions(createUser);
    await salesAndMarketing.addPermissions(editUser);
    await salesAndMarketing.addPermissions(listUser);
    await salesAndMarketing.addPermissions(viewUser);
    await salesAndMarketing.addPermissions(deleteUser); 
    
    await salesAndMarketing.addPermissions(createWorkProgress);
    await salesAndMarketing.addPermissions(editWorkProgress);
    await salesAndMarketing.addPermissions(listWorkProgress);
    await salesAndMarketing.addPermissions(viewWorkProgress);
    await salesAndMarketing.addPermissions(deleteWorkProgress); 
    
    await salesAndMarketing.addPermissions(createBankAccount);
    await salesAndMarketing.addPermissions(editBankAccount);
    await salesAndMarketing.addPermissions(listBankAccount);
    await salesAndMarketing.addPermissions(viewBankAccount);
    await salesAndMarketing.addPermissions(deleteBankAccount);
    
    await salesAndMarketing.addPermissions(createInventory);
    await salesAndMarketing.addPermissions(editInventory);
    await salesAndMarketing.addPermissions(listInventory);
    await salesAndMarketing.addPermissions(viewInventory);
    await salesAndMarketing.addPermissions(deleteInventory); 
    
    await salesAndMarketing.addPermissions(createBuilder);
    await salesAndMarketing.addPermissions(editBuilder);
    await salesAndMarketing.addPermissions(listBuilder);
    await salesAndMarketing.addPermissions(viewBuilder);
    await salesAndMarketing.addPermissions(deleteBuilder);  
    
    await salesAndMarketing.addPermissions(createPurchaser);
    await salesAndMarketing.addPermissions(editPurchaser);
    await salesAndMarketing.addPermissions(listPurchaser);
    await salesAndMarketing.addPermissions(viewPurchaser);
    await salesAndMarketing.addPermissions(deletePurchaser);  
    
    await salesAndMarketing.addPermissions(listRole);
    await salesAndMarketing.addPermissions(viewRole);  

    
    //Sales and marketting
    await accounts.addPermissions(viewOwnProfile);
    await accounts.addPermissions(editOwnProfile);
    
    await accounts.addPermissions(assignUserToCompany);
    await accounts.addPermissions(getCreatedUsers);
    await accounts.addPermissions(makeAdminUser);
    
    await accounts.addPermissions(createCompany);
    await accounts.addPermissions(editCompany);
    await accounts.addPermissions(listCompany);
    await accounts.addPermissions(listOwnCompany);
    await accounts.addPermissions(viewCompany);
    await accounts.addPermissions(deleteCompany);
    
    await accounts.addPermissions(createProject);
    await accounts.addPermissions(editProject);
    await accounts.addPermissions(listProject);
    await accounts.addPermissions(listOwnProject);
    await accounts.addPermissions(viewProject);
    await accounts.addPermissions(deleteProject);
    
    await accounts.addPermissions(createProjectAddress);
    await accounts.addPermissions(editProjectAddress);
    
    await accounts.addPermissions(createQuery);
    await accounts.addPermissions(editQuery);
    await accounts.addPermissions(listQuery);
    await accounts.addPermissions(viewQuery);
    await accounts.addPermissions(deleteQuery);
    
    await accounts.addPermissions(createUser);
    await accounts.addPermissions(editUser);
    await accounts.addPermissions(listUser);
    await accounts.addPermissions(viewUser);
    await accounts.addPermissions(deleteUser); 
    
    await accounts.addPermissions(createWorkProgress);
    await accounts.addPermissions(editWorkProgress);
    await accounts.addPermissions(listWorkProgress);
    await accounts.addPermissions(viewWorkProgress);
    await accounts.addPermissions(deleteWorkProgress); 
    
    await accounts.addPermissions(createBankAccount);
    await accounts.addPermissions(editBankAccount);
    await accounts.addPermissions(listBankAccount);
    await accounts.addPermissions(viewBankAccount);
    await accounts.addPermissions(deleteBankAccount);
    
    await accounts.addPermissions(createInventory);
    await accounts.addPermissions(editInventory);
    await accounts.addPermissions(listInventory);
    await accounts.addPermissions(viewInventory);
    await accounts.addPermissions(deleteInventory); 
    
    await accounts.addPermissions(createBuilder);
    await accounts.addPermissions(editBuilder);
    await accounts.addPermissions(listBuilder);
    await accounts.addPermissions(viewBuilder);
    await accounts.addPermissions(deleteBuilder);  
    
    await accounts.addPermissions(createPurchaser);
    await accounts.addPermissions(editPurchaser);
    await accounts.addPermissions(listPurchaser);
    await accounts.addPermissions(viewPurchaser);
    await accounts.addPermissions(deletePurchaser);  
    
    await accounts.addPermissions(listRole);
    await accounts.addPermissions(viewRole);  
    
    //Construction Finance
    await cf.addPermissions(viewOwnProfile);
    await cf.addPermissions(editOwnProfile);
    
    await cf.addPermissions(assignUserToCompany);
    await cf.addPermissions(getCreatedUsers);
    await cf.addPermissions(makeAdminUser);
    
    await cf.addPermissions(createCompany);
    await cf.addPermissions(editCompany);
    await cf.addPermissions(listCompany);
    await cf.addPermissions(listOwnCompany);
    await cf.addPermissions(viewCompany);
    await cf.addPermissions(deleteCompany);
    
    await cf.addPermissions(createProject);
    await cf.addPermissions(editProject);
    await cf.addPermissions(listProject);
    await cf.addPermissions(listOwnProject);
    await cf.addPermissions(viewProject);
    await cf.addPermissions(deleteProject);
    
    await cf.addPermissions(createProjectAddress);
    await cf.addPermissions(editProjectAddress);
    
    await cf.addPermissions(createQuery);
    await cf.addPermissions(editQuery);
    await cf.addPermissions(listQuery);
    await cf.addPermissions(viewQuery);
    await cf.addPermissions(deleteQuery);
    
    await cf.addPermissions(createUser);
    await cf.addPermissions(editUser);
    await cf.addPermissions(listUser);
    await cf.addPermissions(viewUser);
    await cf.addPermissions(deleteUser); 
    
    await cf.addPermissions(createWorkProgress);
    await cf.addPermissions(editWorkProgress);
    await cf.addPermissions(listWorkProgress);
    await cf.addPermissions(viewWorkProgress);
    await cf.addPermissions(deleteWorkProgress); 
    
    await cf.addPermissions(createBankAccount);
    await cf.addPermissions(editBankAccount);
    await cf.addPermissions(listBankAccount);
    await cf.addPermissions(viewBankAccount);
    await cf.addPermissions(deleteBankAccount);
    
    await cf.addPermissions(createInventory);
    await cf.addPermissions(editInventory);
    await cf.addPermissions(listInventory);
    await cf.addPermissions(viewInventory);
    await cf.addPermissions(deleteInventory); 
    
    await cf.addPermissions(createBuilder);
    await cf.addPermissions(editBuilder);
    await cf.addPermissions(listBuilder);
    await cf.addPermissions(viewBuilder);
    await cf.addPermissions(deleteBuilder);  
    
    await cf.addPermissions(createPurchaser);
    await cf.addPermissions(editPurchaser);
    await cf.addPermissions(listPurchaser);
    await cf.addPermissions(viewPurchaser);
    await cf.addPermissions(deletePurchaser);  
    
    await cf.addPermissions(listRole);
    await cf.addPermissions(viewRole);    

  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('role_permissions', null, {});
    await queryInterface.bulkDelete('roles', null, {});
    return queryInterface.bulkDelete('permissions', null, {});
  }
};