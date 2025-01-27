NAME=$(basename $(pwd))
FORCE=false
# if -f is in any of the arguments, then force the build

for arg in "$@"
do
    if [ "$arg" = "-f" ]; then
        FORCE=true
    fi
done

CMD="docker build -t $NAME $(pwd)"
if [ "$FORCE" = true ]; then
    CMD="docker build --no-cache -t $NAME $(pwd)"
fi
