<!DOCTYPE html>
<html>
<head>
    <title>MPD All Access</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script type="text/javascript" charset="utf8" src="//code.jquery.com/jquery-1.12.3.js"></script>
    <script type="text/javascript" charset="utf8" src="//cdn.datatables.net/1.10.12/js/jquery.dataTables.min.js"></script>
    <script src="https://swisnl.github.io/jQuery-contextMenu/dist/jquery.contextMenu.js" type="text/javascript"></script>
    <script src="https://use.fontawesome.com/2f2f714e84.js"></script>
    <script type="text/javascript" charset="utf8" src="js/scripts.js"></script>
    <script type="text/javascript" charset="utf8" src="js/notify.min.js"></script>
    <link href="https://swisnl.github.io/jQuery-contextMenu/dist/jquery.contextMenu.css" rel="stylesheet" type="text/css" />
    <link rel="stylesheet" type="text/css" href="//cdn.datatables.net/1.10.12/css/jquery.dataTables.min.css">
    <link rel="stylesheet" type="text/css" href="css/style.css">
</head>
<body>

<div class="frm">
    <form id="search" action="" method="get">
        <input type="text" name="artist" value="" placeholder="Artist">
        <input type="text" name="title" value="" placeholder="Title or Album">
        <button type="submit"><i class="fa fa-search" aria-hidden="true"></i></button>
        <div style="clear:both;"></div>
    </form>
</div>

{{>search}}

</body>
</html>
