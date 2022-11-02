'use strict';

/**
 * component-test service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::component-test.component-test');
