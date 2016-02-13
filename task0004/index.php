<!DOCTYPE html>
<html lang="zh-cmn-Hans">
<head>
    <meta charset="UTF-8">
    <title>Mobile TodoList</title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta http-equiv="Cache-Control" content="no-siteapp">
    <meta name="keywords" content="移动端, todolist, backbone">
    <meta name="description" content="移动端todolist实践">
    <meta name="author" content="waynezheng">
    <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

    <!-- apple -->
    <meta name="apple-mobile-web-app-title" content="waynezheng的todolist">
    <meta name="apple-mobile-web-app-capable" content="yes" /> <!-- 是否启用 WebApp 全屏模式 -->
    <link rel="apple-touch-icon" href="apple-touch-icon-iphone.png">
    <link rel="apple-touch-icon" sizes="72x72" href="apple-touch-icon-ipad.png" />
    <link rel="apple-touch-icon" sizes="114x114" href="apple-touch-icon-iphone4.png" />

    <link rel="stylesheet" href="css/common.css">
</head>
<body>

    <!-- 目录列表 -->
    <div id="category-view" class="app-view category-view">
        <header class="app-header">
            <div class="header-container">
                <div class="app-operation">
                    <h2 class="app-title">任务清单</h2>
                </div>
            </div>
        </header>
        <div class="app-content">
            <div class="app-task-list">
                <ul></ul>
            </div>
        </div>
        <footer class="app-footer">
            <div id="add-new-category" class="footer-container">
                <i class="sprite add-icon add-new-category"></i>
            </div>
        </footer>

        <div id="new-category-modal" class="hide">
            <div class="container">
                <a href="javascript:void(0);" class="unwrap-btn">收起</a>
                <input type="text" class="cate-name" placeholder="新清单名称">
                <a href="javascript:void(0);" class="ok-btn">添加</a>
            </div>
        </div>
    </div>
    <script type="text/template" id="category_li">
        <i class="sprite cate-icon"></i>
        <div class="task-content">
            <p class="task-title"><%= name %><span class="task-num">(<%= tasks_count %>)</span></p>
        </div>
        <%= is_default == 1 ? '' : '<i class="sprite delete-icon"></i>' %>
    </script>

    <!-- 任务列表 -->
    <div id="task-list-view" class="app-view task-list-view hide">
        <header class="app-header">
            <div class="header-container">
                <div class="app-operation">
                    <a href="javascript:void(0);" class="back-btn">返回</a>
                    <h2 class="app-title">任务清单</h2>
                    <a href="javascript:void(0);" class="edit-btn"><i></i></a>
                </div>
                <div class="add-new-task-block">
                    <input type="text" placeholder="添加一个新任务" class="new-task-input" id="new-task-input">
                    <a href="javascript:void(0);" class="ok-btn">确定</a>
                </div>
            </div>
        </header>
        <div class="app-content">
            <div class="app-task-list">
                <ul></ul>
            </div>
        </div>
        <footer></footer>
    </div>
    <script type="text/template" id="task_li">
        <input type="checkbox" class="checkbox <%= is_finished ? 'is_finished' : '' %>" <%= is_finished ? 'checked' : '' %>>         
        <div class="task-content">
            <p class="task-title"><%= name %></p>
        </div>
        <i class="sprite delete-icon"></i> 
    </script>

    <!-- 任务查看页 -->
    <div id="task-view" class="app-view task-view hide">
        <header class="app-header">
            <div class="header-container">
                <div class="app-operation">
                    <a href="javascript:void(0);" class="back-btn">返回</a>
                    <h2 class="app-title"></h2>
                    <input type="text" class="edit-title hide" placeholder="输入任务名称">
                </div>
            </div>
        </header>
        <div class="app-content">
            <div class="task-detail">
                <header class="task-header">
                    <i class="sprite time-icon"></i><p class="task-datetime"></p>
                </header>
                <div class="task-content">
                    <textarea name="" id="edit-content" rows="15" placeholder="添加任务描述"></textarea>
                </div>
            </div>
        </div>
    </div>

    <script src="js/lib/require.js" data-main="js/main.js"></script>    
</body>
</html>