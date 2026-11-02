
const { test, expect } = require('@playwright/test');
const { APIHelper } = require('../utils/APIHelper');

test('Perform API CRUD operations', async ({ request }) => {

    const api = new APIHelper(request);

    // Test data
    const objectData = {
        name: 'Sathya Playwright API Test',
        data: {
            year: 2026,
            price: 1500,
            CPU: 'Intel Core i5',
            HardDisk: '512 GB'
        }
    };

    // STEP 1: CREATE - POST
    console.log('STEP 1: Creating an object');

    const createResponse = await api.createObject(objectData);

    expect(createResponse.status()).toBe(200);

    const createdObject = await createResponse.json();

    expect(createdObject.id).toBeTruthy();
    expect(createdObject.name).toBe(objectData.name);

    const objectId = createdObject.id;

    console.log('Object created successfully. ID:', objectId);


    // STEP 2: READ - GET
    console.log('STEP 2: Retrieving the object');

    const getResponse = await api.getObject(objectId);

    expect(getResponse.status()).toBe(200);

    const retrievedObject = await getResponse.json();

    expect(retrievedObject.id).toBe(objectId);
    expect(retrievedObject.name).toBe(objectData.name);

    console.log('Object retrieved successfully');


    // STEP 3: UPDATE - PUT
    console.log('STEP 3: Updating the object');

    const updatedData = {
        name: 'Sathya Updated Playwright API Test',
        data: {
            year: 2026,
            price: 2500,
            CPU: 'Intel Core i7',
            HardDisk: '1 TB'
        }
    };

    const updateResponse = await api.updateObject(
        objectId,
        updatedData
    );

    expect(updateResponse.status()).toBe(200);

    const updatedObject = await updateResponse.json();

    expect(updatedObject.id).toBe(objectId);
    expect(updatedObject.name).toBe(updatedData.name);

    console.log('Object updated successfully');


    // STEP 4: VERIFY UPDATE - GET
    console.log('STEP 4: Verifying updated object');

    const verifyResponse = await api.getObject(objectId);

    expect(verifyResponse.status()).toBe(200);

    const verifiedObject = await verifyResponse.json();

    expect(verifiedObject.name).toBe(updatedData.name);
    expect(verifiedObject.data.price).toBe(2500);
    expect(verifiedObject.data.CPU).toBe('Intel Core i7');

    console.log('Updated object details verified');


    // STEP 5: DELETE - DELETE
    console.log('STEP 5: Deleting the object');

    const deleteResponse = await api.deleteObject(objectId);

    expect(deleteResponse.status()).toBe(200);

    console.log('Object deleted successfully');


    // STEP 6: VERIFY DELETION - GET
    console.log('STEP 6: Verifying object deletion');

    const verifyDeleteResponse = await api.getObject(objectId);

    expect(verifyDeleteResponse.status()).toBe(404);

    console.log('Object deletion verified successfully');
});
