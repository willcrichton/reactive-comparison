module Todo.Todo exposing (main)

import Browser
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick, onInput)

type alias Todo =
  { contents : String
  , completed : Bool
  }

type alias Model =
  { todos : List Todo
  , inputText : String
  }

init : () -> ( Model, Cmd Msg )
init _ =
  ( { todos = []
    , inputText = ""
    }
  , Cmd.none
  )

-- UPDATE

type Msg
  = AddTodo
  | UpdateInput String
  | SetCompleted Int Bool

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
  case msg of
    AddTodo ->
      ( { model
          | todos = model.todos ++ [ { contents = model.inputText, completed = False } ]
          , inputText = ""
        }
      , Cmd.none
      )

    UpdateInput text ->
        ( { model | inputText = text }
        , Cmd.none
        )

    SetCompleted index completed ->
        ( { model
            | todos = List.indexedMap
                (\i todo ->
                    if i == index then
                        { todo | completed = completed }
                    else
                        todo
                )
                model.todos
          }
        , Cmd.none
        )

view : Model -> Html Msg
view model =
    div []
        [ viewAddPanel model
        , viewItemCount model
        , ul []
          (List.indexedMap viewTodoItem model.todos)
        ]

viewAddPanel : Model -> Html Msg
viewAddPanel model =
    div []
        [ button [ onClick AddTodo ] [ text "Add" ]
        , input
            [ type_ "text"
            , value model.inputText
            , onInput UpdateInput
            ] []
        ]

viewItemCount : Model -> Html Msg
viewItemCount model =
    let
        completedCount =
            List.length (List.filter .completed model.todos)
    in
    div []
        [ text "Completed: "
        , span [] [ text (String.fromInt completedCount) ]
        ]

viewTodoItem : Int -> Todo -> Html Msg
viewTodoItem index todo =
    li []
        [ text todo.contents
        , button
            [ onClick (SetCompleted index (not todo.completed)) ]
            [ text (if todo.completed then "Undone" else "Done") ]
        ]

main : Program () Model Msg
main =
    Browser.element
        { init = init
        , update = update
        , view = view
        , subscriptions = \_ -> Sub.none
        }