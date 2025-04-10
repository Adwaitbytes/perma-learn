Handlers.add("recommend", Handlers.utils.hasMatchingTag("App-Name", "PermaLearn"),
  function(msg)
    local records = msg.Data or "[]"
    local parsed = json.decode(records)
    local lastCourse = parsed[#parsed] and parsed[#parsed].name or "Nothing yet"
    local recommendation = "No recommendation yet"

    if lastCourse:match("HTML") then
      recommendation = "Try CSS Basics next!"
    elseif lastCourse:match("CSS") then
      recommendation = "Try JavaScript Basics next!"
    elseif lastCourse:match("JavaScript") then
      recommendation = "Try React Basics next!"
    elseif lastCourse:match("React") then
      recommendation = "Try Node.js Basics next!"
    elseif lastCourse ~= "Nothing yet" then
      recommendation = "Keep exploring advanced topics!"
    end

    ao.send({
      Target = msg.From,
      Data = recommendation
    })
  end
)