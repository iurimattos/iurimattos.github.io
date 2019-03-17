(function ($) {

    // https://developers.facebook.com/apps/380087835831757/review-status/
    // Acessar o endereço web https://iurimatos.com.br/cartas-do-altissimo clicar em Administrador (mobile: botao menu depois Administrador) preencher o confirm com vazio (string vazia) logar no facebook, Preencher o campo "Mensagem" e clicar em Enviar

    var pageId;
    var access_token;
    var message;

    function initFacebookGraph() {
        window.fbAsyncInit = function () {
            FB.init({
                appId: '380087835831757',
                xfbml: true,
                version: 'v3.0'
            });
            FB.AppEvents.logPageView();
        };

        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }

    document.onreadystatechange = function () {
        if (document.readyState == "interactive") {
            if (location.protocol != 'https:') {
                location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
            }
        }
    }

    function promptAuth() {
        $('#welcomeADM').click(function () {
            var password = prompt('Insira sua senha administrador(a) :');
            if (password === '') {
                alert('Bem vindo(a)');
                $('#myModal').modal('show');
                facebookAuth();

            } else {
                alert('Senha inválida');
                return;
            }

        });
    }

    function facebookAuth() {
        FB.login(function (response) {
            if (response.authResponse) {
                access_token = response.authResponse.accessToken;
                FB.api(
                    "/debug_token?input_token=" + access_token,
                    function (response) {
                        if (response && !response.error) {
                            if (response.data.is_valid) {

                                FB.api(response.data.user_id + '/accounts', function (response) {
                                    if (response) {

                                        response.data.forEach(function (page) {

                                            if (page.name === 'Cartas Do Altissimo') {

                                                access_token = page.access_token;
                                                pageId = page.id;

                                            }

                                        });


                                    }
                                });
                            }
                        }
                    }
                );
            }
        });
    }

    function post() {

        $('#postMessage').click(function () {
            message = $('#c_message').val();


            FB.api(
                '/' + pageId + '/feed',
                'POST', {
                    "message": message,
                    "access_token": access_token
                },
                function (response) {

                }
            );

        });
    }

    function affixHeader() {
        $('#topnavbar').affix({
            offset: {
                top: $('#banner').height()
            }
        });
    }


    affixHeader();
    post();
    promptAuth();
    initFacebookGraph();

})(jQuery);