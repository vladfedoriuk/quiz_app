$(document).ready(function () {


    $(document).on("click", "#edit-confirm", function(){
        for( var index = 0; index < document.forms.length; index++) {
            //document.forms[index].submit();
            var form = document.forms[index];
            if(form.id){
                $.ajax({
                    url: form.action,
                    type: "PUT",
                    data: $("#"+form.id).serialize(),
                    success: function(data){
                    
                    }
                });
            }
        }
    });
});


$(document).ready(function () {


    $(document).on("click", "#pass-quiz", function(){
        for( var index = 0; index < document.forms.length; index++) {
            //document.forms[index].submit();
            var form = document.forms[index];
            var results = [];
            if(form.id){
                $.ajax({
                    url: form.action,
                    type: "POST",
                    data: $("#"+form.id).serialize(),
                    success: function(data){
                        results.push(data);
                    }
                });
            }
        }
        $(document).ajaxStop(function(){
            var table = document.createElement('table');
            table.className +="centered";
            var tbody = document.createElement('tbody');
            for(var i = 0; i<results.length; i++){
                var tr = document.createElement('tr');
                for(property in results[i]){
                    if(results[i].hasOwnProperty(property)){
                        var td = document.createElement('td');
                        var p = document.createElement('p');
                        var score = 0;
                        if(results[i].comment == 'OK'){
                            score = results[i].points
                        }
                        p.innerText = results[i][property];
                        if(property=='points'){
                            p.innerText = ''+score+'/'+results[i][property];
                        }
                        td.appendChild(p);
                        tr.appendChild(td);
                    }
                }
                tbody.appendChild(tr);
            }
            table.appendChild(tbody);
            var btn = document.getElementById('pass-quiz');
            btn.parentNode.replaceChild(table, btn);
        });
    });
});

