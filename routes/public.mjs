import express from "express"

export default express.static("./public", {
    index: "index.htm"
})