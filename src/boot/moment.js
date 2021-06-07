import Vue from 'vue'


const moment = require('moment')
// moment.locale('id');
require('moment/locale/id')


Vue.use(require('vue-moment'), {
    moment
})