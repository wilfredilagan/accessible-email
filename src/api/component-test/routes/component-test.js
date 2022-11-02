'use strict';

/**
 * component-test router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::component-test.component-test');
