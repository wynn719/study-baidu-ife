/**
 * last time change :　基础功能完成
 */
(function() {
    var taskBox = document.querySelector('#task-box');
    var allTodos = document.querySelector('#all-todos .mainnav'),
        allTodosCount = document.querySelector('#all-todos .all-task-count'),
        categorys = document.querySelector('.categorys .mainnav');

    var currentTask = document.querySelector('.current-task'),
        currentCate = null,
        currentSubCate = null;

    var newTaskBtn = document.querySelector('#add-new-task-btn'),
        currentTaskPanel = document.querySelector('#current-task-panel'),
        newTaskPanel = document.querySelector('#new-task-panel'),
        newTaskTitle = newTaskPanel.querySelector('#new-task-title'),
        newTaskDate = newTaskPanel.querySelector('.task-datetime span'),
        newTaskTextarea = newTaskPanel.querySelector('.real-textarea'),
        newOkBtn = newTaskPanel.querySelector('.ok-btn'),
        newCancelBtn = newTaskPanel.querySelector('.cancel-btn');

    var realBlock = currentTaskPanel.querySelector('#real-block'),
        realTextarea = realBlock.querySelector('.real-textarea'),
        editOkBtn = realBlock.querySelector('.ok-btn'),
        editCancelBtn = realBlock.querySelector('.cancel-btn'),
        richTextarea = currentTaskPanel.querySelector('.rich-textarea');

    var addNewCateBtn = document.querySelector('.add-new-category');

    var allTodos = document.querySelector('#all-todos .mainnav');

    var currentTaskTitle = currentTaskPanel.querySelector('.task-title'),
        currentTaskDate = currentTaskPanel.querySelector('.task-datetime span');

    var category = document.querySelectorAll('#menu .dropdown'),
        mainnav = document.querySelector('.categorys .mainnav');

    var menu = document.querySelector('#menu'),
        submenu = document.querySelector('#submenu');

    var tabnav = submenu.querySelector('.top-tab'),
        tabnavA = tabnav.querySelectorAll('a'),
        tabpanel = submenu.querySelectorAll('.tabpanel');

    var todoApp = {
        render: function(data) {
            var html = '';
            var tasks = this.data['tasks'],
                cate = this.data['cate'],
                sub_cate = this.data['sub_cate'];

            // 所有任务初始化
            for (var i = 0, len = tasks.length; i < len; i++) {
                html += this.template.task(tasks[i], i);
            }
            allTodosCount.innerHTML = '(' + tasks.length + ')';
            allTodos.innerHTML = html;

            html = ''; // 重置

            // 目录初始化
            for (var i = 0, len = cate.length; i < len; i++) {
                html += this.template.cate(cate[i], i, data);
            }
            categorys.innerHTML = html;
        },
        init: function() {
            var app = this;
            app.render(this.data);
            app.saveSnapshot();

            // 新建任务事件绑定   
            $.dom.click(newTaskBtn, function(event) {
                newTaskDate.innerHTML = $.date.getNow();
                app.showEdtiPanel();
            });

            $.dom.click(newOkBtn, function(event) {

                var data = {
                    name: newTaskTitle.value,
                    date: newTaskDate.innerHTML,
                    content: newTaskTextarea.value,
                    cateid: currentCate ? $.dom.getData(currentCate, 'cate-id') : 0,
                    subCateid: currentSubCate ? $.dom.getData(currentSubCate, 'sub-cate-id') : false
                };

                app.addTask(data);
                app.clearRichtext();
                app.showPanel();
            });

            $.dom.click(newCancelBtn, function(event) {
                app.clearRichtext();
                app.showPanel();
            });

            // 编辑任务事件绑定
            $.dom.click(richTextarea, function(event) {
                realTextarea.innerHTML = this.innerHTML;
                app.showRealBlock();
            });

            $.dom.click(editOkBtn, function(event) {
                var taskid = $.dom.getData(currentTaskPanel, 'task-id');
                textData = {
                    text: realTextarea.value
                };
                app.editTask(taskid, textData);
                richTextarea.innerHTML = textData.text;
                app.showRichBlock();
            });

            $.dom.click(editCancelBtn, function(event) {
                realTextarea.innerHTML = '';
                app.showRichBlock();
            });

            // 新增分类事件绑定
            $.dom.click(addNewCateBtn, function(event) {
                var ret = prompt('请输入分类名称'),
                    cateid = 0,
                    data = {};
                if (ret !== null && ret !== '') {
                    if (currentCate) { // 子分类添加
                        cateid = $.dom.getdata(currentCate, 'cate-id');
                        app.addSubCate(data);
                    } else { // 分类添加
                        data = {
                            name: ret
                        }
                        app.addCate(data);
                    }
                }
            });

            // 任务事件展示绑定
            $.dom.delegate(taskBox, '.task', 'click', function(event) {
                var self = this,
                    taskid = $.dom.getData(self, 'task-id');

                app.renderTask(taskid);
            });

            $.dom.delegate(taskBox, '.task-del', 'click', function(event) {
                var self = this,
                    taskid = $.dom.getData(self.parentNode, 'task-id');

                app.delTask(taskid);
            });

            // 二级分类事件绑定
            $.dom.delegate(taskBox, '.sub-cate', 'click', function(event) {
                var self = this,
                    subCateid = $.dom.getData(self, 'sub-cate-id');

                currentSubCate = self;

                $.dom.setData(submenu, 'subcate_id', subCateid);

                app.renderSubmenu(subCateid, 'all');
            });

            $.dom.delegate(taskBox, '.sub-cate-del', 'click', function(event) {
                var self = this,
                    subCateid = $.dom.getData(self.parentNode, 'sub-cate-id');

                app.delSubCate(subCateid);
            });

            // 一级分类事件绑定
            $.dom.delegate(taskBox, '.category', 'click', function(event) {
                var self = this,
                    cateid = $.dom.getData(self, 'cate-id');

                currentCate = self;

                app.renderCate(cateid);
            });

            $.dom.delegate(taskBox, '.category-del', 'click', function(event) {
                var self = this,
                    cateid = $.dom.getData(self.parentNode, 'cate-id');

                app.delCate(cateid);
            });

            // 下拉事件绑定
            $.dom.delegate(menu, '.dropdown-toggle', 'click',function(event) {
                var toggle = this,
                    dropdownMenu = $.dom.nextSibling(toggle);

                currentCate = this.parentNode.parentNode;

                if (!$.dom.hasClass(toggle, 'active')) {
                    dropdownMenu.style.display = 'block';
                    $.dom.addClass(toggle, 'active');
                } else {
                    dropdownMenu.style.display = 'none';
                    $.dom.removeClass(toggle, 'active');
                }
            });

            $.dom.delegate(submenu, '.dropdown-toggle', 'click',function(event) {
                var toggle = this,
                    dropdownMenu = $.dom.nextSibling(toggle);

                if (!$.dom.hasClass(toggle, 'active')) {
                    dropdownMenu.style.display = 'block';
                    $.dom.addClass(toggle, 'active');
                } else {
                    dropdownMenu.style.display = 'none';
                    $.dom.removeClass(toggle, 'active');
                }
            });

            $.dom.delegate(submenu, '.task-name', 'click', function(event) {
                var self = this,
                    parent = self.parentNode,
                    taskid = $.dom.getData(parent, 'task-id');

                app.renderTask(taskid);
            });

            // 中间栏事件绑定
            $.dom.delegate(tabnav, 'a', 'click',function(event) {
                var toggle = this,
                    type = $.dom.getData(toggle, 'type');

                var tab = document.querySelector('#tab-' + type + '-tasks').parentNode;
                var subCateid = $.dom.getData(submenu, 'subcate_id');

                for(var i = 0, len = tabpanel.length; i < len; i++){
                    $.dom.removeClass(tabnavA[i], 'active');
                    tabpanel[i].style.display = 'none';
                }
                tab.style.display = 'block';
                $.dom.addClass(toggle, 'active');

                app.renderSubmenu(subCateid, type);
            });
        },

        renderTask: function(taskid) {
            var data = this.data['tasks'][taskid];
            $.dom.setData(currentTaskPanel, 'cate-id', data['cate']);
            $.dom.setData(currentTaskPanel, 'sub-cate-id', data['sub_cate']);
            $.dom.setData(currentTaskPanel, 'task-id', taskid);
            currentTaskTitle.innerHTML = data['name'];
            currentTaskDate.innerHTML = data['time'];
            richTextarea.innerHTML = data['content'];
        },

        renderSubmenu: function(subcateid, type) {
            var data = this.data['tasks'];
            var html = this.template.submenu(data, subcateid, type);
            var temp = document.querySelector('#tab-' + type +'-tasks');
            temp.innerHTML = html;
        },

        addTask: function(data) {
            var task = {
                "name": data.name,
                "time": data.date,
                "content": data.content,
                "cate": parseInt(data.cateid),
                "sub_cate": parseInt(data.subCateid),
                "is_finished": false
            };
            this.data['tasks'].push(task);
            if (!data.subCateid) {
                this.data['cate'][data.cateid]['has_task'] += 1;
            } else {
                this.data['sub_cate'][data.subCateid]['tasks_len'] += 1;
            }
            this.data['cate'][data.cateid]['tasks_len'] += 1;
            this.render(this.data);
        },

        editTask: function(taskid, data) {
            this.data['tasks'][taskid]['content'] = data['text'];
            this.render(this.data);
        },

        delTask: function(taskid) {
            var task = this.data['tasks'][taskid],
                cate = null,
                subCate = null;

            var r = confirm('确定删除该任务?');

            if (!r) {
                return;
            }

            this.data['cate'][task['cate']]['tasks_len'] -= 1;

            if (task['sub_cate']) {
                this.data['sub_cate'][task['sub_cate']]['tasks_len'] -= 1;
            }
            this.data['tasks'].splice(taskid, 1);
            this.render(this.data);
        },

        addCate: function(data) {
            var cate = {
                "name": data.name,
                "has_subcate": false,
                "has_task": false,
                "tasks_len": 0
            };
            this.data['cate'].push(cate);
            this.render(this.data);
        },

        delCate: function(cateid) {
            var cate = this.data['cate'][cateid],
                task = null,
                subCate = null;

            var r = confirm('确定删除该分类?');

            if (!r) {
                return;
            }

            if (cate['has_subcate']) {
                for(var i = this.data['sub_cate'].length - 1; i >= 0; i--) {
                    if(this.data['sub_cate'][i]['cate'] == cateid) {
                       this.data['sub_cate'].splice(i, 1);
                    }
                }
            }

            if (cate['has_task']) {
                for(var i = this.data['tasks'].length - 1; i >= 0; i--) {
                    if(this.data['tasks'][i]['cate'] == cateid) {
                       this.data['tasks'].splice(i, 1);
                    }
                }
            }
            this.data['cate'].splice(cateid, 1);
            this.render(this.data);
        },

        addSubCate: function(data) {
            var subCate = {
                "name": data.name,
                "cate": data.cateid,
                "tasks_len": 0
            };
            this.data['sub_cate'].push(subCate);
            this.data['cate'][data.cateid]['has_subcate'] = true;
            this.render(this.data);
        },

        delSubCate: function(subCateid) {
            var subCate = this.data['sub_cate'][subCateid],
                task = null,
                cateid = subCate['cate'];

            var r = confirm('确定删除该分类?');

            if (!r) {
                return;
            }

            if (subCate['tasks_len']) {
                for(var i = subCate['tasks_len'] - 1; i >= 0; i--){
                    if (this.data['tasks'][i]['sub_cate'] == subCateid) {
                        this.data['tasks'].splice(i, 1);
                    }
                }
            }
            this.data['cate'][subCate['cate']]['has_subcate'] -= 1;
            this.data['cate'][cateid]['tasks_len'] -= subCate['tasks_len'];
            this.data['sub_cate'].splice(subCateid, 1);
            this.render(this.data);
        },

        showRealBlock : function() {
            $.dom.removeClass(realBlock, 'hide');
            $.dom.addClass(richTextarea, 'hide');
        },

        showRichBlock : function() {
            $.dom.addClass(realBlock, 'hide');
            $.dom.removeClass(richTextarea, 'hide');
        },

        showEdtiPanel : function() {
            $.dom.removeClass(newTaskPanel, 'hide');
            $.dom.addClass(currentTaskPanel, 'hide');   
        },

        showPanel : function() {
            $.dom.removeClass(currentTaskPanel, 'hide');
            $.dom.addClass(newTaskPanel, 'hide');
        },

        clearRichtext : function() {
            newTaskTitle.value = '';
            newTaskTextarea.value = '';
        },

        // 每n分钟保存一次
        saveSnapshot : function() {
            var app = this;
            setInterval(function() {
                localStorage.data = JSON.stringify(app.data);
            }, 1000);            
        },

        // 模板
        template: {
            // 分类模板
            cate: function(data, id, all) {
                var html = '';
                html = '<li class="category" data-cate-id="' + id + '">';
                html += '<div class="dropdown">';
                html += '<a class="dropdown-toggle" href="javascript:void(0);">' + data['name'] + '<span class="todo-count">(' + data['tasks_len'] + ')</a>';
                html += '<ul class="subnav dropdown-menu">';

                // 如果有子目录
                if (data['has_subcate']) {
                    var subCateData = all['sub_cate'];
                    for (var i = 0; i < subCateData.length; i++) {
                        if (subCateData[i]['cate'] !== id) {
                            continue;
                        }

                        html += this.sub_cate(subCateData[i], i);
                    }
                }

                // 如果有子任务
                if (data['has_task']) {
                    var tasksData = all['tasks'];
                    for (var i = 0; i < tasksData.length; i++) {
                        if (tasksData[i]['cate'] !== id || tasksData[i]['sub_cate']) {
                            continue;
                        }

                        html += this.task(tasksData[i], i);
                    }
                }

                html += '</ul>';
                html += '</div>';
                html += '<span class="category-del">&times;</span>';
                html += '</li>';

                return html;
            },

            // 子分类模板
            sub_cate: function(data, id) {
                var html = '';
                html = '<li class="sub-cate" data-sub-cate-id="' + id + '">' + data['name'] + '<span class="task-count">(' + data['tasks_len'] + ')</span><span class="sub-cate-del">&times;</span></li>';

                return html;
            },

            // 任务模板
            task: function(data, id) {
                var html = '';
                html = '<li class="task" data-task-id="' + id + '">' + data['name'] + '<span class="task-del">&times;</span></li>';

                return html;
            }, 

            // 中间栏模板
            submenu: function(data, subcateid, type) {
                var html = '';

                for(var i = 0, len = data.length; i < len; i++){
                    if (data[i]['sub_cate'] === parseInt(subcateid)) {
                        switch(type){
                            case 'all':
                                html += '<li class="task' + (data[i]['is_finished'] ? ' finished' : '') + '" data-task-id="' + i +  '"><p class="task-time">' + data[i]['time'] + '</p><p class="task-name">' + data[i]['name'] + '</p></li>';
                                break;

                            case 'unfinished':
                                if (!data[i]['is_finished']) {
                                    html += '<li class="task' + (data[i]['is_finished'] ? ' finished' : '') + '" data-task-id="' + i +  '"><p class="task-time">' + data[i]['time'] + '</p><p class="task-name">' + data[i]['name'] + '</p></li>';
                                }
                                break;

                            case 'finished':
                                if (data[i]['is_finished']) {
                                    html += '<li class="task' + (data[i]['is_finished'] ? ' finished' : '') + '" data-task-id="' + i +  '"><p class="task-time">' + data[i]['time'] + '</p><p class="task-name">' + data[i]['name'] + '</p></li>';
                                }
                                break;
                        }
                    }
                }

                return html;
            }
        }
    };

    // 本地有数据，直接从本地取，否则读取默认数据
    todoApp.data = localStorage.data ? JSON.parse(localStorage.data) : data;
    todoApp.init();
})();