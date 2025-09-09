import requests,time,csv,re,json,sys,math,random,io
import uuid,shutil,logging,os
from pathlib import Path
from typing import Optional,Tuple
from datetime import datetime, timezone,timedelta

from fastapi import FastAPI, Query, HTTPException, Header, BackgroundTasks, Request, Response
from fastapi.responses import HTMLResponse, JSONResponse,StreamingResponse,FileResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.concurrency import run_in_threadpool

# logging
logging.basicConfig(level=logging.INFO)
logger= logging.getLogger("report-saver")

# FastAPI code
app= FastAPI(title="Auto Report API (CSV → PDF/DOCX)")

# CORS allow all in dev, restrict in production
origins=[
    "http://localhost:8000",                     # for local testing
]
app.add_middleware(CORSMiddleware, allow_origins=origins,allow_credentials=True, allow_methods=["*"],allow_headers=["*"])

@app.get("/")
def home():
    return {"message":"server working"}

if __name__=='__main__':
    import uvicorn
    port= int(os.environ.get("PORT",8000))
    logger.info("Starting on port %s",port)
    uvicorn.run("main:app",host="0.0.0.0",port=port,log_level="info")