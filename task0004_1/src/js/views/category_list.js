define(['backbone', 'jquery', 'underscore', 'collections/categorys', 'views/category', 'common', 'collections/tasks', 'zeptoTouch'], function(Backbone, $, _, CategoryCollection, CategoryView, Common, TaskCollection) {

    // 目录列表页
    var CategoryListView = Backbone.View.extend({
        initialize: function() {
            this.collection = CategoryCollection;
            this.tasksCollection = TaskCollection;

            this.$AddCategoryModal = $('#new-category-modal');
            this.$inputCateName = this.$AddCategoryModal.find('.cate-name');
            this.$refreshBtn = this.$('.refresh-btn');

            this.listenTo(this.collection, 'add', this.addOne);
            this.listenTo(this.collection, 'reset', this.addAll);
            this.listenTo(this.collection, 'all', this.render);
            this.listenTo(this.collection, 'add_category_invalid', this.addInvalid);

            this.listenTo(this.tasksCollection, 'increase', this.increaseTasksCount);
            this.listenTo(this.tasksCollection, 'remove', this.decreaseTasksCount);

            this.collection.fetch();
        },

        el: $('#category-view'),

        events: Common.is_phone() ? {
            'tap #add-new-category': 'showAddCategoryModal',
            'tap #new-category-modal .ok-btn': 'addOneCategory',
            'tap #new-category-modal .unwrap-btn': 'hideAddCategoryModal',
            'tap .app-content': 'hideAddCategoryModal',
            'keypress #new-category-modal .cate-name': 'addOnEnter',
            'tap .refresh-btn': 'refreshPage'
        } : {
            'click #add-new-category': 'showAddCategoryModal',
            'click #new-category-modal .ok-btn': 'addOneCategory',
            'click #new-category-modal .unwrap-btn': 'hideAddCategoryModal',
            'click .app-content': 'hideAddCategoryModal',
            'keypress #new-category-modal .cate-name': 'addOnEnter',
            'click .refresh-btn': 'refreshPage'
        },

        render: function() {
            if (!this.collection.length) {}
        },

        showAddCategoryModal: function(event) {
            this.$AddCategoryModal.removeClass('hide');
            this.$inputCateName.focus();
        },

        hideAddCategoryModal: function(event) {
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
            this.collection.each(this.addOne, this);
        },

        // 添加一个新的目录
        addOneCategory: function(event) {
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

        addOnEnter: function(event) {
            if (event.which === Common.ENTER_KEY) {
                this.addOneCategory();
            }
        },

        // 更新对应目录的子任务数
        increaseTasksCount: function(cateId) {
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
        },

        refreshPage: function (event) {
            event.preventDefault();

            window.location.reload(false);
        },

        addInvalid: function (model, error) {
            model.destroy();
            alert(error);
        }
    });

    return CategoryListView;
});