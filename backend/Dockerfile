mcr.microsoft.com/dotnet/sdk:6.0

WORKDIR /backend

COPY . .

RUN dotnet build -c Release -o /backend/out

EXPOSE 7144

CMD ["dotnet", "run", "--urls", "https://0.0.0.0:7144"]

