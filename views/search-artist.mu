<div style="width:100%;">

{{#.}}
    <div id="{{artist.artistId}}" class="artist-card card">
    	<a href="?artist_id={{artist.artistId}}">
    		<div class="card" style="background:url('{{artist.artistArtRef}}') no-repeat center center;"></div>
    	</a>
    	<div class="info" style="">
    		<a href="?artist_id={{artist.artistId}}">{{artist.name}}</a>
    		<br/>
    		<a href="{{artist.artist_bio_attribution.source_url}}"><i class="fa fa-wikipedia-w" aria-hidden="true"></i></a>
    		<a href="http://www.google.com/search?q={{artist.name}}"><i class="fa fa-google" aria-hidden="true"></i></a>
    	</div>
    </div>
{{/.}}

<div style="clear:both;"></div>
</div>
