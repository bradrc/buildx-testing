# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and project files to restore dependencies
COPY ["BuildX.sln", "./"]
COPY ["backend/BuildX.Api/BuildX.Api.csproj", "backend/BuildX.Api/"]
COPY ["backend/BuildX.Application/BuildX.Application.csproj", "backend/BuildX.Application/"]
COPY ["backend/BuildX.Domain/BuildX.Domain.csproj", "backend/BuildX.Domain/"]
COPY ["backend/BuildX.Infrastructure/BuildX.Infrastructure.csproj", "backend/BuildX.Infrastructure/"]

RUN dotnet restore "BuildX.sln"

# Copy the rest of the source code
COPY backend/ backend/

# Build and publish the API project
WORKDIR "/src/backend/BuildX.Api"
RUN dotnet publish "BuildX.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 80
EXPOSE 443
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "BuildX.Api.dll"]
