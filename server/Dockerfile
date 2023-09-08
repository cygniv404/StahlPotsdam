FROM python:3.11-slim AS base
RUN apt-get update && apt-get upgrade -y
RUN adduser --system --group --no-create-home app
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
RUN echo "" >> /app/logs/debug.log
RUN chown -R app:app /app

FROM python:3.11-slim AS production
COPY --from=base /app/ /app
COPY --from=base /usr/local/lib/python3.11 /usr/local/lib/python3.11
RUN pip install gunicorn
RUN pip install gevent
EXPOSE 8080
WORKDIR /app
CMD ["gunicorn", "-b :8080","--log-level=debug", "--worker-class=gevent", "main:app"]