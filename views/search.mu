<div style="padding:20px;">
<ul class="cards" id="artist-cards">

{{#artists}}
    <li id="{{artist.artistId}}" class="artist-card card">
    	<a href="?artist_id={{artist.artistId}}">
    		<div class="image card" style="background:url('{{artist.artistArtRef}}') no-repeat center center;"></div>
    	</a>
    	<div class="info" style="">
    		<a href="?artist_id={{artist.artistId}}">{{artist.name}}</a>
    	</div>
    </li>
{{/artists}}

</ul>
</div>

<table id="table" class="display">
<tbody>

{{#tracks}}
    <tr id="{{track.storeId}}">
        <td style="display:none;">{{track.score}}</td>
        <td><a href="?artist_id={{track.artistId}}">{{track.artist}}</a></td>
        <td>{{track.title}}<div><a href="?album_id={{track.albumId}}">{{track.album}}</a>&nbsp;({{track.year}})</div></td>
        <td style="width:1px;white-space:nowrap;">
        	<span class="btn track" data-track="{{track.storeId}}" data-mode="add">
        		<i class="fa fa-plus" aria-hidden="true"></i>
			</span>
        	<span class="btn track" data-track="{{track.storeId}}" data-mode="play">
        		<i class="fa fa-play" aria-hidden="true"></i>
			</span>
        	<span class="context-menu-one btn btn-neutral" data-id="{{track.albumId}}" data-album="{{track.albumId}}" data-track="{{track.storeId}}" data-artist="{{track.artistId}}">
        		<i class="fa fa-ellipsis-v" aria-hidden="true"></i>
        	</span>
        </td>
    </tr>
{{/tracks}}

</tbody>
</table>