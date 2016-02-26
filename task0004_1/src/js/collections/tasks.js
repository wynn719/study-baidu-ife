define(['backbone', 'jquery', 'underscore', 'models/task', 'localStorage'], function(Backbone, $, _, Task, LocalStorage) {
    var Tasks = Backbone.Collection.extend({
        model: Task,

        localStorage: new LocalStorage("Task-data")
    });

    var tasks = new Tasks();

    return tasks;
});