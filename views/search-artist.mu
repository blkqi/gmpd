<div style="width:100%;">

{{#.}}
    <div id="{{artist.artistId}}" class="artist-card card">
    	<a href="?artist_id={{artist.artistId}}">
    		<div class="image card" style="background:url('{{artist.artistArtRef}}') no-repeat center center;"></div>
    	</a>
    	<div class="info" style="">
    		<a href="?artist_id={{artist.artistId}}">{{artist.name}}</a>
    	</div>
    </div>
{{/.}}

<div style="clear:both;"></div>
</div>
