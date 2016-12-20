<table id="table" class="display">
<tbody>

{{#.}}
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
{{/.}}

</tbody>
</table>
