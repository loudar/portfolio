const buttonsJson = {
    "$schema": "https://illegal.trading/.well-known/button.schema.json",
    "default": "webbutton",
    "buttons": [
        {
            "id": "webbutton",
            "uri": "https://illegal.trading/img/webbutton.png",
            "alt": "illegal.trading - an 88x31 button",
            "caption": "illegal.trading",
            "link": "https://illegal.trading",
            "hotlink": true,
            "sha256": "8d67b162a7f7eff88252628c2c087c5e9f2bc3395258b9b5859ad137d14a505f",
            "animations": "none",
            "imageRendering": "pixelated"
        }
    ]
};

export const handleButtonsJson = (): Response =>
    new Response(JSON.stringify(buttonsJson, null, 2), {
        headers: { "Content-Type": "application/json; charset=utf-8" }
    });

