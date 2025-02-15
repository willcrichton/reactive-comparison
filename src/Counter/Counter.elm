module Counter.Counter exposing (main)

import Browser
import Html exposing (Html, button, div, span, text)
import Html.Events exposing (onClick)

type alias Model = Int

init : () -> ( Model, Cmd Msg )
init _ = ( 0, Cmd.none )

type Msg = Increment

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model = case msg of
    Increment -> (model + 1, Cmd.none)

view : Model -> Html Msg
view model =
    div []
        [ button [ onClick Increment ] [ text "+" ]
        , span [] [ text (String.fromInt model) ]
        ]

main : Program () Model Msg
main =
    Browser.element
        { init = init
        , update = update
        , view = view
        , subscriptions = \_ -> Sub.none
        }