<div style="padding:10px;">
<ul class="cards" id="artist-cards">

{{#artists}}
    <li id="{{artistId}}" class="artist-card card">
    	<a href="?artist_id={{artistId}}">
    		<div class="image card" style="background:url('{{artistArtRef}}') no-repeat center center;"></div>
    	</a>
    	<div class="info" style="">
    		<a href="?artist_id={{artistId}}">{{name}}</a>
    	</div>
    </li>
{{/artists}}

</ul>
</div>

<table id="table" class="display">
<tbody>

{{#tracks}}
    <tr id="{{storeId}}">
        <td style="display:none;">{{score}}</td>
        <td><a href="?artist_id={{artistId}}">{{artist}}</a></td>
        <td>{{title}}<div><a href="?album_id={{albumId}}">{{album}}</a>&nbsp;({{year}})</div></td>
        <td style="width:1px;white-space:nowrap;">
        	<span class="btn track" data-track="{{storeId}}" data-mode="add">
        		<i class="fa fa-plus" aria-hidden="true"></i>
			</span>
        	<span class="btn track" data-track="{{storeId}}" data-mode="play">
        		<i class="fa fa-play" aria-hidden="true"></i>
			</span>
        	<span class="context-menu-one btn btn-neutral" data-id="{{albumId}}" data-album="{{albumId}}" data-track="{{storeId}}" data-artist="{{artistId}}">
        		<i class="fa fa-ellipsis-v" aria-hidden="true"></i>
        	</span>
        </td>
    </tr>
{{/tracks}}

</tbody>
</table>
