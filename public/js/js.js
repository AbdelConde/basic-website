function misAudios()
{
	document.getElementById("control_audio").style.display='';
        document.getElementById("my_audio").style.display='';
	document.getElementById("contenido").innerHTML='<div class="widget"><h1>Stored Recordings</h1><ul id="recordingslist"></ul></div>';
}
function perfil()
{
	document.getElementById("control_audio").style.display='none';
        document.getElementById("my_audio").style.display='none';
	document.getElementById("contenido").innerHTML='<div class="widget"></div>';
}
