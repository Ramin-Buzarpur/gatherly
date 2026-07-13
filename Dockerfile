FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY gatherly.sln ./
COPY API/API.csproj ./API/
COPY Application/Application.csproj ./Application/
COPY Domain/Domain.csproj ./Domain/
COPY Infrastructure/Infrastructure.csproj ./Infrastructure/
COPY Persistence/Persistence.csproj ./Persistence/

RUN dotnet restore API/API.csproj

COPY . .
WORKDIR /src/API
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final

WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 8080
ENTRYPOINT ["dotnet", "API.dll"]