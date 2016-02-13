define(['backbone', 'jquery', 'underscore', 'collections/categorys', 'views/category', 'common', 'collections/tasks'], function(Backbone, $, _, CategoryCollection, CategoryView, Common, TaskCollection) {

    // 目录列表页
    var CategoryListView = Backbone.View.extend({
        initialize: function() {
            this.collection = CategoryCollection;
            this.tasksCollection = TaskCollection;

            this.$AddCategoryModal = $('#new-category-modal');
            this.$inputCateName = this.$AddCategoryModal.find('.cate-name');

            this.listenTo(this.collection, 'add', this.addOne);
            this.listenTo(this.collection, 'reset', this.addAll);
            this.listenTo(this.collection, 'all', this.render);

            this.listenTo(this.tasksCollection, 'add', this.increaseTasksCount);
            this.listenTo(this.tasksCollection, 'remove', this.decreaseTasksCount);

            this.collection.fetch();
        },

        el: $('#category-view'),

        events: {
            'click #add-new-category': 'showAddCategoryModal',
            'click #new-category-modal .ok-btn': 'addOneCategory',
            'click #new-category-modal .unwrap-btn': 'hideAddCategoryModal',
            'click .app-content': 'hideAddCategoryModal',
            'keypress #new-category-modal .cate-name': 'addOnEnter'
        },

        render: function() {
            if (!this.collection.length) {}
        },

        showAddCategoryModal: function(e) {
            this.$AddCategoryModal.removeClass('hide');
            this.$inputCateName.focus();
        },

        hideAddCategoryModal: function(e) {
            this.$AddCategoryModal.addClass('hide');
            this.$inputCateName.val('');
        },

        addOne: function(category) {
            var view = new CategoryView({
                model: category
            });
            this.$("ul").append(view.render().el);
        },

        addAll: function() {
            // console.log('all');
            this.collection.each(this.addOne, this);
        },

        // 添加一个新的目录
        addOneCategory: function(e) {
            var cateName = this.$('.cate-name').val();

            if (cateName) {
                this.collection.create({
                    name: cateName
                });
            } else {
                this.collection.create();
            }
            this.hideAddCategoryModal();
        },

        addOnEnter: function(e) {
            if (e.which === Common.ENTER_KEY) {
                this.addOneCategory();
            }
        },

        // 更新对应目录的子任务数
        increaseTasksCount: function(task) {
            var cateId = task.get('cate');
            var category = this.collection.findWhere({
                id: cateId
            });
            category.updateSubcateCount('add');
        },

        decreaseTasksCount: function(task) {
            var cateId = task.get('cate');
            var category = this.collection.findWhere({
                id: cateId
            });
            category.updateSubcateCount('remove');
        }
    });

    return CategoryListView;
});