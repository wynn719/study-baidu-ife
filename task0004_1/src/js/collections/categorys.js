define(['backbone', 'jquery', 'underscore', 'models/category', 'localStorage'], function(Backbone, $, _, Category, LocalStorage) {
    var Categorys = Backbone.Collection.extend({
        // 指定collection对应的model
        model: Category,

        localStorage: new Backbone.LocalStorage("Category-data")
    });

    var categorys = new Categorys();

    return categorys;
});