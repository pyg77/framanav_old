
<div id="framanavOpenID" class="box">
<form id="openidForm" name="openidForm">
<label>
<span>Identifiant</span>
<input type="text" class="input-text focus" name="login" id="login"/><br/>
<span>Mot de passe</span>
<input type="text" class="input-text" name="password" id="password"/>
<br />
<a href="#" onClick="javascript:submit()" class="green">
Me connecter
</a>
</form>
<p><a href="#">créer mon compte</a> - <a href="#">connexion sécurisée</a><br /><a href="#">qu'est-ce que OpenID ?</a></p>
</label>
</div>
<script type="text/javascript">
$(window).load(function() {
  $("input.focus").focus();
}); 
</script>
