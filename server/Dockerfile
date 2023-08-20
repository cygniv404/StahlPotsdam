FROM python:3.9-slim AS base
RUN apt-get update && apt-get upgrade -y
RUN adduser --system --group --no-create-home app
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
RUN chown -R app:app /app

FROM python:3.9-slim AS production
COPY --from=base /app/ /app
COPY --from=base /usr/local/lib/python3.9 /usr/local/lib/python3.9
RUN pip install gunicorn
RUN pip install gevent
EXPOSE 8080
WORKDIR /app
CMD ["gunicorn", "-b :8080","--log-level=debug", "--worker-class=gevent", "main:app"]