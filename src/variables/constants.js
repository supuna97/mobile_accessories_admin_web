const SERVER_URL = `http://localhost:8080/api/v1`;

const USER_KEY = 'userRole';

const USER_ROLES = Object.freeze({
    HEAD_OFFICE_ADMIN: `HEAD_OFFICE_ADMIN`,
    BRANCH_ADMIN: `BRANCH_ADMIN`,
    SUPPLIER:'SUPPLIER',
    CUSTOMER:'CUSTOMER'
});

export {SERVER_URL, USER_KEY, USER_ROLES};