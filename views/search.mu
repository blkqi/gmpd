
<div class="t"><button class="track" data-mode="add" disabled>Add</button><button class="track" data-mode="play" disabled>Play</button><button id="select">Select All</button></div>
<table id="table" class="display">
<thead><tr>
    <th style="display:none;">Relevance</th>
    <th></th>
    <th>Artist</th>
    <th>Title</th>
    <th></th>
</tr></thead>
<tbody>

{{#.}}
    <tr id="{{track.storeId}}">
    <td style="display:none;">{{track.score}}</td>
    <td class="num"><img src="img/unchecked.png"/></td>
    <td><a href="?artist={{track.artist}}&exact=yes">{{track.artist}}</a></td>
    <td>{{track.title}}<div><a href="?artist={{track.albumArtist}}&title={{track.album}}&exact=yes">{{track.album}}</a>&nbsp;({{track.year}})</div></td>
    <td width="1"><span class="context-menu-one btn btn-neutral" data-id="{{track.albumId}}" data-track="{{track.title}}" data-artist="{{track.artist}}" data-album="Album - {{track.albumArtist}} - {{track.album}}"><i class="fa fa-ellipsis-h" aria-hidden="true"></i></span></td>
    </tr>
{{/.}}

</tbody>
</table>

